import { useEffect, useState } from "react";
import { getLang, type Lang } from "./i18n";

/**
 * 日誌重點標記(贊助者功能 log-tools)。
 *
 * 分類規則的 regex 全部對照「真實的 PalDefender log」(格式 `[時:分:秒][等級] 訊息`)整理:
 *   加入   'Name' (UserId=…, IP=…) has logged in.  /  steam_xxx ('IP') connected to the server.
 *   離開   'Name' (…) has logged out.
 *   聊天   [Chat::Global]['Name' (UserId=…)]: 訊息
 *   死亡   'Name' (…) died to …  /  was attacked by a wild '…' and died.
 *   捕捉   'Name' (…) has captured Pal '…' at x y z.  /  picked up Pal '…'
 *   警告   [warning] …
 *   錯誤   [error] … / LowLevelFatalError / Error:
 * 判斷依「陣列順序」由上而下,第一個命中的分類決定顏色(聊天/加入等 info 事件要排在
 * warn/error 之前)。
 */
export interface LogCategory {
  id: string;
  label: string;
  /** 預設顏色(hex);管理員可在設定覆寫,存 localStorage。 */
  color: string;
  test: RegExp;
}

export const LOG_CATEGORIES: LogCategory[] = [
  { id: "chat", label: "聊天", color: "#5fb0ff", test: /\[Chat::/i },
  { id: "join", label: "玩家加入", color: "#57d38c", test: /connected to the server|has logged in\b/i },
  { id: "leave", label: "玩家離開", color: "#9aa4b2", test: /has logged out\b|disconnected from the server/i },
  { id: "death", label: "死亡", color: "#ff6b6b", test: /\bdied to\b|and died\.|was killed\b/i },
  { id: "capture", label: "捕捉帕魯", color: "#c792ea", test: /has captured Pal|picked up Pal/i },
  { id: "warn", label: "警告", color: "#ffcf5f", test: /\[warning\]|(?:^|\s)Warning:/i },
  { id: "error", label: "錯誤", color: "#ff5c7a", test: /\[error\]|LowLevelFatalError|(?:^|\s)Error:/i },
];

/** 依上到下的優先序回傳第一個命中的分類 id;都沒中回 null(用預設色)。 */
export function classifyLine(line: string): string | null {
  for (const c of LOG_CATEGORIES) if (c.test.test(line)) return c.id;
  return null;
}

const COLOR_KEY = "palserver.logColors";
const ON_KEY = "palserver.logHighlight";
const EVENT = "palserver:logprefs";

function readColors(): Record<string, string> {
  try {
    const v = JSON.parse(localStorage.getItem(COLOR_KEY) ?? "{}");
    return v && typeof v === "object" ? (v as Record<string, string>) : {};
  } catch {
    return {};
  }
}

/** 合併預設色 + 管理員覆寫,得到「分類 id → 生效顏色」。 */
export function effectiveColors(): Record<string, string> {
  const over = readColors();
  return Object.fromEntries(LOG_CATEGORIES.map((c) => [c.id, over[c.id] ?? c.color]));
}

export function setCategoryColor(id: string, color: string): void {
  const next = { ...readColors(), [id]: color };
  localStorage.setItem(COLOR_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(EVENT));
}

export function resetColors(): void {
  localStorage.removeItem(COLOR_KEY);
  window.dispatchEvent(new Event(EVENT));
}

export function getHighlightOn(): boolean {
  return localStorage.getItem(ON_KEY) !== "0";
}
export function setHighlightOn(on: boolean): void {
  localStorage.setItem(ON_KEY, on ? "1" : "0");
  window.dispatchEvent(new Event(EVENT));
}

/** 訂閱上色偏好(顏色 + 開關),任一變動就重繪。 */
export function useLogPrefs(): {
  colors: Record<string, string>;
  on: boolean;
  setColor: (id: string, c: string) => void;
  setOn: (on: boolean) => void;
  reset: () => void;
} {
  const [, bump] = useState(0);
  useEffect(() => {
    const h = () => bump((n) => n + 1);
    window.addEventListener(EVENT, h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener(EVENT, h);
      window.removeEventListener("storage", h);
    };
  }, []);
  return {
    colors: effectiveColors(),
    on: getHighlightOn(),
    setColor: setCategoryColor,
    setOn: setHighlightOn,
    reset: resetColors,
  };
}

/** 目前介面語言 → Google Translate 的目標語碼。 */
export function translateTarget(lang: Lang = getLang()): string {
  return lang === "zh" ? "zh-TW" : lang === "ja" ? "ja" : "en";
}
