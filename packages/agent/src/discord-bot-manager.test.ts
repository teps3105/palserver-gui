import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type { InstanceStore } from "./store.js";
import { DiscordBotManager } from "./discord-bot-manager.js";

// 這些測試鎖定 wantsLogEvents / wantsBossEvents —— bot-only 訂閱能否驅動 log/boss 追蹤器啟動。
// 這是修「只設 Discord bot(未設 webhook)時收不到聊天/頭目」bug 的行為證明。

function tempDir(prefix: string): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}
function makeStore(instanceDir: string): InstanceStore {
  return { instanceDir: () => instanceDir } as unknown as InstanceStore;
}
function writeBotState(instanceDir: string, settings: Record<string, unknown>): void {
  fs.mkdirSync(instanceDir, { recursive: true });
  fs.writeFileSync(path.join(instanceDir, "discord-bot.json"), JSON.stringify({ settings }, null, 2));
}
function mgr(instanceDir: string, feature = true): DiscordBotManager {
  return new DiscordBotManager(makeStore(instanceDir), "http://127.0.0.1:0", () => feature);
}
function withDir(fn: (dir: string) => void): void {
  const dir = tempDir("dbm-");
  try {
    fn(dir);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

test("啟用 + 有通知頻道 + 訂閱 player.chat → wantsLogEvents true、wantsBossEvents false", () => {
  withDir((dir) => {
    writeBotState(dir, { enabled: true, notifyChannelId: "123", notifyEvents: ["player.chat"] });
    const m = mgr(dir);
    assert.equal(m.wantsLogEvents("i1"), true);
    assert.equal(m.wantsBossEvents("i1"), false);
  });
});

test("訂閱 boss.respawn → wantsBossEvents true、wantsLogEvents false", () => {
  withDir((dir) => {
    writeBotState(dir, { enabled: true, notifyChannelId: "123", notifyEvents: ["boss.respawn"] });
    const m = mgr(dir);
    assert.equal(m.wantsBossEvents("i1"), true);
    assert.equal(m.wantsLogEvents("i1"), false);
  });
});

test("只訂閱 server/join 類事件 → log/boss 兩者皆 false(不白跑追蹤器)", () => {
  withDir((dir) => {
    writeBotState(dir, { enabled: true, notifyChannelId: "123", notifyEvents: ["server.running", "player.join"] });
    const m = mgr(dir);
    assert.equal(m.wantsLogEvents("i1"), false);
    assert.equal(m.wantsBossEvents("i1"), false);
  });
});

test("bot 未啟用 → 即使訂閱 chat 也 false", () => {
  withDir((dir) => {
    writeBotState(dir, { enabled: false, notifyChannelId: "123", notifyEvents: ["player.chat"] });
    assert.equal(mgr(dir).wantsLogEvents("i1"), false);
  });
});

test("未設通知頻道 → 即使訂閱 chat 也 false", () => {
  withDir((dir) => {
    writeBotState(dir, { enabled: true, notifyChannelId: "", notifyEvents: ["player.chat"] });
    assert.equal(mgr(dir).wantsLogEvents("i1"), false);
  });
});

test("授權閘門關閉 → false", () => {
  withDir((dir) => {
    writeBotState(dir, { enabled: true, notifyChannelId: "123", notifyEvents: ["player.chat"] });
    assert.equal(mgr(dir, false).wantsLogEvents("i1"), false);
  });
});

test("死亡/捕捉也算 log 事件 → wantsLogEvents true", () => {
  withDir((dir) => {
    writeBotState(dir, { enabled: true, notifyChannelId: "123", notifyEvents: ["player.death"] });
    assert.equal(mgr(dir).wantsLogEvents("i1"), true);
  });
});
