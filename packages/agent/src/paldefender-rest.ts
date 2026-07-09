import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import type { PdPal, PdItemSlot, PdRestStatus, PlayerDetail } from "@palserver/shared";
import type { DriverContext } from "./driver.js";
import type { InstanceRecord } from "./store.js";
import { serverRoot } from "./native.js";
import { rconExec } from "./rcon.js";

/**
 * Proxy to PalDefender's own REST API (v1/pdapi on port 17993), which exposes
 * per-player pals and inventory that the game's built-in REST API can't.
 *
 * Token handling: the agent manages its own bearer token file under
 * RESTAPI/Tokens/palserver-gui.json (a full-permission token, since it only
 * runs on localhost and is never exposed to the browser). If the file is
 * missing it's created and `reloadcfg` is issued so PalDefender picks it up.
 * As with everything else, the browser only ever talks to the agent.
 */

const TOKEN_FILE = "palserver-gui.json";

function pdDir(rec: InstanceRecord, ctx: DriverContext): string | null {
  const win64 = path.join(serverRoot(rec, ctx), "Pal", "Binaries", "Win64");
  for (const name of ["PalDefender", "palguard"]) {
    const dir = path.join(win64, name);
    if (fs.existsSync(dir)) return dir;
  }
  return null;
}

function restConfig(dir: string): { enabled: boolean; port: number } {
  try {
    const cfg = JSON.parse(fs.readFileSync(path.join(dir, "RESTAPI", "RESTConfig.json"), "utf8"));
    return { enabled: cfg.Enabled === true, port: Number(cfg.Port) || 17993 };
  } catch {
    return { enabled: false, port: 17993 };
  }
}

/** Read our token, creating it (and reloading PalDefender) if absent. */
async function ensureToken(rec: InstanceRecord, dir: string): Promise<string> {
  const tokensDir = path.join(dir, "RESTAPI", "Tokens");
  const file = path.join(tokensDir, TOKEN_FILE);
  if (fs.existsSync(file)) {
    const token = JSON.parse(fs.readFileSync(file, "utf8")).Token;
    if (typeof token === "string" && token.length > 0) return token;
  }
  fs.mkdirSync(tokensDir, { recursive: true });
  const token = crypto.randomBytes(32).toString("base64url");
  fs.writeFileSync(
    file,
    JSON.stringify({ Name: "palserver GUI", Token: token, Permissions: ["REST.*"] }, null, 4),
  );
  // Tell PalDefender to reload so the new token is accepted without a restart.
  await rconExec(rec, "reloadcfg").catch(() => {});
  return token;
}

export function getPdRestStatus(rec: InstanceRecord, ctx: DriverContext): PdRestStatus {
  if (rec.backend !== "native") {
    return { enabled: false, hasToken: false, reason: "玩家細節僅支援原生模式的實例" };
  }
  const dir = pdDir(rec, ctx);
  if (!dir) return { enabled: false, hasToken: false, reason: "尚未安裝 PalDefender" };
  const { enabled } = restConfig(dir);
  if (!enabled) {
    return {
      enabled: false,
      hasToken: false,
      reason: "PalDefender REST API 未啟用 — 請在 RESTAPI/RESTConfig.json 設 Enabled=true 並重啟",
    };
  }
  const hasToken = fs.existsSync(path.join(dir, "RESTAPI", "Tokens", TOKEN_FILE));
  return { enabled: true, hasToken };
}

async function pdFetch<T>(rec: InstanceRecord, dir: string, endpoint: string): Promise<T> {
  const { port } = restConfig(dir);
  const token = await ensureToken(rec, dir);
  const res = await fetch(`http://127.0.0.1:${port}/v1/pdapi${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) {
    const code = await res.json().then((b) => b?.Error?.Code).catch(() => null);
    throw new Error(`PalDefender REST ${endpoint} → HTTP ${res.status}${code ? ` (${code})` : ""}`);
  }
  return (await res.json()) as T;
}

function collectPals(pals: Record<string, unknown> | undefined, location: PdPal["location"]): PdPal[] {
  if (!pals || typeof pals !== "object") return [];
  return Object.entries(pals).map(([instanceId, raw]) => {
    const p = (raw ?? {}) as Record<string, unknown>;
    return {
      instanceId,
      palId: String(p.PalID ?? ""),
      nickname: String(p.Nickname ?? ""),
      gender: String(p.Gender ?? ""),
      level: Number(p.Level ?? 0),
      shiny: Boolean(p.Shiny),
      location,
    };
  });
}

function collectItems(inventory: Record<string, unknown> | undefined): PdItemSlot[] {
  if (!inventory || typeof inventory !== "object") return [];
  const out: PdItemSlot[] = [];
  for (const [container, raw] of Object.entries(inventory)) {
    const slots = (raw as { Slots?: Record<string, unknown> })?.Slots;
    if (!slots) continue;
    for (const slot of Object.values(slots)) {
      const s = (slot ?? {}) as Record<string, unknown>;
      const itemId = String(s.ItemID ?? "");
      if (itemId) out.push({ itemId, count: Number(s.Count ?? 0), container });
    }
  }
  return out;
}

export async function getPlayerDetail(
  rec: InstanceRecord,
  ctx: DriverContext,
  identifier: string,
): Promise<PlayerDetail> {
  const status = getPdRestStatus(rec, ctx);
  if (!status.enabled) {
    return {
      available: false,
      reason: status.reason,
      name: "",
      playerUid: "",
      userId: "",
      guildName: "",
      pals: [],
      teamCount: 0,
      palboxCount: 0,
      items: [],
    };
  }
  const dir = pdDir(rec, ctx)!;

  try {
    const [player, palsRes, itemsRes] = await Promise.all([
      pdFetch<{ Player?: Record<string, unknown> }>(rec, dir, `/player/${encodeURIComponent(identifier)}`),
      pdFetch<{ Meta?: Record<string, unknown>; Pals?: Record<string, unknown> }>(rec, dir, `/pals/${encodeURIComponent(identifier)}`),
      pdFetch<{ Inventory?: Record<string, unknown> }>(rec, dir, `/items/${encodeURIComponent(identifier)}`),
    ]);

    const p = player.Player ?? {};
    const pals = palsRes.Pals ?? {};
    return {
      available: true,
      name: String(p.Name ?? ""),
      playerUid: String(p.PlayerUID ?? ""),
      userId: String(p.UserId ?? ""),
      guildName: String(p.GuildName ?? ""),
      pals: [
        ...collectPals(pals.Team as Record<string, unknown>, "team"),
        ...collectPals(pals.Palbox as Record<string, unknown>, "palbox"),
      ],
      teamCount: Number(palsRes.Meta?.TeamCount ?? 0),
      palboxCount: Number(palsRes.Meta?.PalboxCount ?? 0),
      items: collectItems(itemsRes.Inventory as Record<string, unknown>),
    };
  } catch (err) {
    return {
      available: false,
      reason: err instanceof Error ? err.message : String(err),
      name: "",
      playerUid: "",
      userId: "",
      guildName: "",
      pals: [],
      teamCount: 0,
      palboxCount: 0,
      items: [],
    };
  }
}
