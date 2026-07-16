import { useCallback, useEffect, useState } from "react";
import { FiCopy, FiCheck, FiGlobe, FiExternalLink, FiShield, FiMessageCircle, FiX, FiZap } from "react-icons/fi";
import type { ConnectionInfo } from "@palserver/shared";
import type { AgentClient } from "./api";
import { copyText } from "./clipboard";
import { usePromoConfig } from "./promoConfig";
import { t, useI18n } from "./i18n";
import { card, btn as btnPrimary, btnGhost } from "./ui";

/** "How do my friends join?" — the question every host actually asks, laid
 * out for non-technical users: same-network, VPN (Radmin / Tailscale), and
 * the advanced public route, each with a copy-ready address. */
export function ConnectionCard({
  client,
  instanceId,
  onDismiss,
}: {
  client: AgentClient;
  instanceId: string;
  onDismiss?: () => void;
}) {
  useI18n();
  const [info, setInfo] = useState<ConnectionInfo | null>(null);
  const { ipService, vpn } = usePromoConfig();
  // 連線方式三選一(每實例記憶);playit 是新手最短路徑,當預設
  const [method, setMethodState] = useState<"playit" | "vpn" | "direct">(
    () => (localStorage.getItem(`palserver.connMethod.${instanceId}`) as "playit" | "vpn" | "direct") || "playit",
  );
  const setMethod = (m: "playit" | "vpn" | "direct") => {
    setMethodState(m);
    localStorage.setItem(`palserver.connMethod.${instanceId}`, m);
  };
  const [addr, setAddr] = useState("");
  const [savingAddr, setSavingAddr] = useState(false);
  const saveAddr = async () => {
    setSavingAddr(true);
    try {
      await client.setExternalAddress(instanceId, addr.trim());
      refresh();
    } finally {
      setSavingAddr(false);
    }
  };

  const refresh = useCallback(() => {
    client
      .connection(instanceId)
      .then((i) => {
        setInfo(i);
        setAddr((prev) => (prev === "" ? (i.externalAddress ?? "") : prev));
      })
      .catch(() => setInfo(null));
  }, [client, instanceId]);

  useEffect(() => refresh(), [refresh]);

  if (!info) return null;
  const port = info.gamePort;

  return (
    <div className={`${card} flex flex-col gap-3`}>
      <div className="flex items-start justify-between gap-2">
        <h3 className="inline-flex min-w-0 items-center gap-2 text-sm font-extrabold">
          <FiGlobe className="size-4 shrink-0 text-pal" /> {t("邀請朋友加入")}
        </h3>
        {onDismiss && (
          <button
            className="-mr-1 -mt-1 rounded-lg p-1 text-ink-muted transition hover:bg-card-soft hover:text-ink"
            onClick={onDismiss}
            title={t("隱藏此卡片(可在設定恢復)")}
            aria-label={t("隱藏此卡片(可在設定恢復)")}
          >
            <FiX className="size-4" />
          </button>
        )}
      </div>

      {/* 三選一:依朋友的情況挑一種就好,新手不用全部看懂 */}
      <div className="grid gap-2 sm:grid-cols-3">
        {(
          [
            { id: "playit", icon: <FiZap className="size-4" />, name: "playit.gg", tag: t("最簡單:朋友什麼都不用裝") },
            { id: "vpn", icon: <FiShield className="size-4" />, name: "VPN", tag: t("你和朋友裝同一套免費 VPN") },
            { id: "direct", icon: <FiGlobe className="size-4" />, name: t("直連"), tag: t("公開 IP + 路由器開埠(進階)") },
          ] as const
        ).map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMethod(m.id)}
            className={`rounded-xl border-2 px-3 py-2 text-left transition ${
              method === m.id ? "border-pal bg-pal/5" : "border-line bg-card-soft/40 hover:border-pal/50"
            }`}
          >
            <p className="inline-flex items-center gap-1.5 text-[13px] font-extrabold">
              {m.icon} {m.name}
            </p>
            <p className="mt-0.5 text-[11px] leading-snug text-ink-muted">{m.tag}</p>
          </button>
        ))}
      </div>

      {method === "playit" && (
        <Section
          icon={<FiZap className="size-4 text-pal" />}
          title={t("playit.gg — 免費隧道,五分鐘搞定")}
          hint={t("playit 給你一個公開位址,自動轉發到這台伺服器:不用動路由器,朋友直接輸入位址就能玩。")}
        >
          <ol className="mb-2 flex list-decimal flex-col gap-1 pl-5 text-xs text-ink-muted">
            <li>{t("到 playit.gg 下載並安裝(免費,支援 Windows/Linux),執行後照指示在網頁按「同意」完成綁定。")}</li>
            <li>{t("在 playit 網頁按「Create Tunnel」:類型選 Custom → UDP,Local port 填 {port}。", { port })}</li>
            <li>{t("把 playit 給你的位址(例:xxx.gl.ply.gg:12345)貼到下面,之後這張卡就會顯示給朋友的位址。")}</li>
          </ol>
          <a
            className={`${btnGhost} mb-2 inline-flex items-center gap-1.5 px-3 py-1 text-xs`}
            href="https://playit.gg"
            target="_blank"
            rel="noreferrer"
          >
            <FiExternalLink className="size-3.5" /> {t("前往 playit.gg")}
          </a>
          <div className="flex flex-wrap items-center gap-2">
            <input
              className="min-w-0 flex-1 rounded-lg border-2 border-line bg-card px-3 py-1.5 font-mono text-sm"
              value={addr}
              placeholder={t("貼上 playit 位址(例:xxx.gl.ply.gg:12345)")}
              onChange={(e) => setAddr(e.target.value)}
              maxLength={120}
            />
            <button
              type="button"
              className={`${btnPrimary} px-3 py-1.5 text-xs`}
              onClick={() => void saveAddr()}
              disabled={savingAddr || addr.trim() === (info.externalAddress ?? "")}
            >
              {savingAddr ? t("儲存中…") : t("儲存")}
            </button>
          </div>
          {info.externalAddress && (
            <div className="mt-2">
              <p className="mb-1 text-xs font-bold text-ink-muted">{t("給朋友的位址(點擊複製):")}</p>
              <AddressChip address={info.externalAddress} />
            </div>
          )}
        </Section>
      )}

      {method === "vpn" && (
        <Section
          icon={<FiShield className="size-4 text-pal" />}
          title={t("用 VPN 連線")}
          hint={t("不用動路由器、也不怕外網攻擊。你和朋友裝同一套免費 VPN、加入同一個網路,就像在同一個 WiFi 裡。")}
        >
          {info.vpns.map((v) => (
            <div key={v.name} className="mb-2">
              <p className="mb-1 text-xs font-bold text-ink-muted">
                {t("你的 {name} 位址:", { name: v.name })}
              </p>
              <AddressChip address={`${v.address}:${port}`} />
            </div>
          ))}
          <div className="grid gap-2 sm:grid-cols-2">
            <VpnOption
              name="Radmin VPN"
              desc={t("免註冊、建個房間邀朋友加入,最適合遊戲聯機。")}
              site={vpn.radmin.site}
              tutorial={vpn.radmin.tutorial}
            />
            <VpnOption
              name="Tailscale"
              desc={t("用 Google/GitHub 帳號登入,安全穩定,適合長期使用。")}
              site={vpn.tailscale.site}
              tutorial={vpn.tailscale.tutorial}
            />
          </div>
        </Section>
      )}

      {method === "direct" && (
        <>
          {info.publicIp && (
            <Section
              icon={<FiGlobe className="size-4 text-pal" />}
              title={t("公開 IP 直連")}
              hint={
                info.behindNat
                  ? t("你的主機在路由器(NAT)後面:要在路由器把 UDP {port} 轉發到這台電腦,朋友才能用下面的位址連入。CGNAT(電信共享 IP)則開埠也沒用,請改用 playit.gg 或 VPN。", { port })
                  : t("朋友直接輸入下面的位址即可(請確認防火牆放行 UDP {port})。", { port })
              }
            >
              <AddressChip address={`${info.publicIp}:${port}`} />
            </Section>
          )}
          <div className="rounded-xl border-2 border-pal/40 bg-pal/5 p-3">
            <p className="inline-flex items-center gap-2 text-[13px] font-extrabold">
              <FiGlobe className="size-4 text-pal" />
              {t("覺得麻煩?交給我們設定")}
            </p>
            <p className="mt-1 text-xs text-ink-muted">
              {t("連接埠轉發、防火牆、CGNAT⋯⋯公開直連對新手很麻煩,交給我們一次設定到位。")}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <a
                className={`${btnPrimary} inline-flex items-center gap-1.5`}
                href={ipService.website}
                target="_blank"
                rel="noreferrer"
              >
                <FiExternalLink className="size-4" /> {t(ipService.name)}
              </a>
              <a
                className={`${btnGhost} inline-flex items-center gap-1.5`}
                href={ipService.discord}
                target="_blank"
                rel="noreferrer"
              >
                <FiMessageCircle className="size-4" /> {t("Discord 詢問")}
              </a>
            </div>
          </div>
        </>
      )}

      <p className="text-xs text-ink-muted">
        {t("提示:朋友連線用的是「遊戲埠 UDP {port}」。若朋友連不進來,先確認伺服器正在運作中、且防火牆有放行。", { port })}
      </p>
    </div>
  );
}

function Section({
  icon,
  title,
  hint,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border-2 border-line p-3">
      <p className="inline-flex items-center gap-2 text-[13px] font-extrabold">
        {icon}
        {title}
      </p>
      <p className="mt-1 mb-2 text-xs text-ink-muted">{hint}</p>
      {children}
    </div>
  );
}

function AddressChip({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    if (await copyText(address)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };
  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-2 rounded-lg border-2 border-line bg-card-soft px-3 py-1.5 font-mono text-sm font-bold transition hover:border-pal"
      title={t("點擊複製")}
    >
      {address}
      {copied ? <FiCheck className="size-4 text-grass" /> : <FiCopy className="size-4 text-ink-muted" />}
    </button>
  );
}

function VpnOption({
  name,
  desc,
  site,
  tutorial,
}: {
  name: string;
  desc: string;
  site: string;
  tutorial: string;
}) {
  return (
    <div className="rounded-xl bg-card-soft p-3">
      <p className="text-sm font-extrabold">{name}</p>
      <p className="mt-0.5 text-xs text-ink-muted">{desc}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <a
          className={`${btnGhost} inline-flex items-center gap-1.5 px-3 py-1 text-xs`}
          href={site}
          target="_blank"
          rel="noreferrer"
        >
          <FiExternalLink className="size-3.5" /> {t("官方網站")}
        </a>
        <a
          className={`${btnGhost} inline-flex items-center gap-1.5 px-3 py-1 text-xs`}
          href={tutorial}
          target="_blank"
          rel="noreferrer"
        >
          <FiExternalLink className="size-3.5" /> {t("教學影片")}
        </a>
      </div>
    </div>
  );
}
