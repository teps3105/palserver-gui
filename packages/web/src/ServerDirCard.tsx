import { useEffect, useState } from "react";
import { FiCheck, FiEdit2, FiFolder, FiHardDrive, FiX } from "react-icons/fi";
import type { AgentClient } from "./api";
import { copyText } from "./clipboard";
import { t, useI18n } from "./i18n";
import { Overlay, btn, btnGhost, card, errorCls, inputCls } from "./ui";

/**
 * 總覽頁的「伺服器路徑」卡片(僅 native):顯示伺服器檔案實際所在的絕對路徑,
 * 並提供修改。改路徑不搬檔案 —— 指到既有 PalServer 安裝就直接採用;指到空/新
 * 資料夾則下次啟動時安裝到那裡;留空回到 agent 管理的資料夾。伺服器需先停止。
 */
export function ServerDirCard({
  client,
  instanceId,
  serverDir,
  effectiveServerDir,
  busy,
  onChanged,
}: {
  client: AgentClient;
  instanceId: string;
  /** 使用者自訂的路徑;null 代表交給 agent 管理。 */
  serverDir: string | null;
  /** 檔案實際所在的絕對路徑(agent 管理時也算得出來)。 */
  effectiveServerDir: string | null;
  /** 伺服器運行/安裝中:此時不允許改路徑。 */
  busy: boolean;
  onChanged: () => void;
}) {
  useI18n();
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const managed = serverDir === null;
  const shown = effectiveServerDir ?? serverDir ?? "—";

  const copy = async () => {
    if (await copyText(shown)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className={`${card} flex flex-col gap-3`}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="inline-flex items-center gap-2 text-sm font-extrabold text-ink-muted">
          <FiHardDrive className="size-4 text-pal" /> {t("伺服器路徑")}
        </h3>
        <button
          className={`${btnGhost} inline-flex items-center gap-1.5 px-3 py-1 text-xs`}
          onClick={() => setEditing(true)}
          disabled={busy}
          title={busy ? t("請先停止伺服器") : undefined}
        >
          <FiEdit2 className="size-3.5" /> {t("修改")}
        </button>
      </div>

      <button
        onClick={copy}
        title={t("點擊複製")}
        className="flex w-full items-center justify-between gap-2 rounded-lg border-2 border-line bg-card-soft px-3 py-2 text-left font-mono text-[13px] font-bold break-all transition hover:border-pal"
      >
        <span className="break-all">{shown}</span>
        {copied && <FiCheck className="size-4 shrink-0 text-grass" />}
      </button>

      <p className="text-xs text-ink-muted">
        {managed
          ? t("這個路徑由 agent 自動管理。你可以改指到自己的安裝目錄。")
          : t("你指定的伺服器安裝目錄。")}
      </p>

      {editing && (
        <ServerDirDialog
          client={client}
          instanceId={instanceId}
          current={serverDir ?? ""}
          onClose={() => setEditing(false)}
          onSaved={() => {
            setEditing(false);
            onChanged();
          }}
        />
      )}
    </div>
  );
}

function ServerDirDialog({
  client,
  instanceId,
  current,
  onClose,
  onSaved,
}: {
  client: AgentClient;
  instanceId: string;
  current: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  useI18n();
  const [value, setValue] = useState(current);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => setValue(current), [current]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await client.updateServerDir(instanceId, value.trim());
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setBusy(false);
    }
  };

  return (
    <Overlay onClose={onClose}>
      <form
        className={`${card} flex w-[460px] max-w-full flex-col gap-3`}
        onClick={(e) => e.stopPropagation()}
        onSubmit={save}
      >
        <div className="flex items-center justify-between">
          <h2 className="inline-flex items-center gap-2 text-lg font-extrabold">
            <FiFolder className="size-5 text-pal" /> {t("修改伺服器路徑")}
          </h2>
          <button
            type="button"
            className="text-ink-muted transition hover:text-ink"
            onClick={onClose}
            aria-label={t("關閉")}
          >
            <FiX className="size-5" />
          </button>
        </div>

        <label className="flex flex-col gap-1.5 text-left text-[13px] font-bold text-ink-muted">
          {t("伺服器路徑(絕對路徑)")}
          <input
            className={`${inputCls} font-mono`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={t("例:{path}", { path: "D:\\palworld\\my-server" })}
            autoFocus
          />
        </label>

        <p className="rounded-xl bg-card-soft px-3 py-2 text-xs text-ink-muted">
          {t("改路徑不會搬移檔案。填既有的 PalServer 安裝目錄會直接採用;填空資料夾或新路徑則會在下次啟動時安裝到那裡;留空則回到 agent 管理的資料夾。")}
        </p>

        {error && <p className={errorCls}>{error}</p>}

        <div className="mt-1 flex gap-2">
          <button className={btn} disabled={busy}>
            {busy ? t("儲存中…") : t("儲存")}
          </button>
          <button type="button" className={btnGhost} onClick={onClose}>
            {t("取消")}
          </button>
        </div>
      </form>
    </Overlay>
  );
}
