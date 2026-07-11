import { useState } from "react";
import { FiAlertTriangle, FiHardDrive, FiSave, FiTrash2 } from "react-icons/fi";
import type { InstanceDetail } from "@palserver/shared";
import type { AgentClient } from "./api";
import { CopyPath } from "./CopyPath";
import { t, useI18n } from "./i18n";
import { btn, btnDanger, card, errorCls, inputCls, labelCls } from "./ui";

/**
 * 實例的「設定」分頁:目前放伺服器路徑修改與危險操作(刪除)。刻意和「世界設定」
 * (遊戲玩法)、「引擎微調」(效能)分開 —— 這裡是這個實例本身的管理設定。
 */
export function InstanceSettingsTab({
  client,
  detail,
  onChanged,
  onDeleted,
}: {
  client: AgentClient;
  detail: InstanceDetail;
  onChanged: () => void;
  onDeleted: () => void;
}) {
  useI18n();
  // 伺服器運行/安裝中不允許改路徑或刪除,避免行程與檔案狀態改到分家。
  const stopped = detail.status === "exited" || detail.status === "created" || detail.status === "missing";

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      {detail.backend === "native" && (
        <ServerPathCard
          client={client}
          instanceId={detail.id}
          serverDir={detail.serverDir}
          effectiveServerDir={detail.effectiveServerDir}
          stopped={stopped}
          onChanged={onChanged}
        />
      )}

      <DangerZone
        client={client}
        instanceId={detail.id}
        name={detail.name}
        adminPassword={String(detail.settings.AdminPassword ?? "")}
        onDeleted={onDeleted}
      />
    </div>
  );
}

function ServerPathCard({
  client,
  instanceId,
  serverDir,
  effectiveServerDir,
  stopped,
  onChanged,
}: {
  client: AgentClient;
  instanceId: string;
  serverDir: string | null;
  effectiveServerDir: string | null;
  stopped: boolean;
  onChanged: () => void;
}) {
  const [value, setValue] = useState(serverDir ?? "");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const managed = serverDir === null;
  const dirty = value.trim() !== (serverDir ?? "");

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await client.updateServerDir(instanceId, value.trim());
      setNotice(t("已儲存伺服器路徑。"));
      setTimeout(() => setNotice(null), 3000);
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className={`${card} flex flex-col gap-3`} onSubmit={save}>
      <h3 className="inline-flex items-center gap-2 text-sm font-extrabold">
        <FiHardDrive className="size-4 text-pal" /> {t("伺服器路徑")}
      </h3>

      <div>
        <p className="mb-1 text-xs font-bold text-ink-muted">{t("目前路徑")}</p>
        {effectiveServerDir ? (
          <CopyPath
            value={effectiveServerDir}
            className="w-full rounded-lg border-2 border-line bg-card-soft px-3 py-2 font-mono text-[13px]"
          />
        ) : (
          <span className="text-[13px] text-ink-muted">{t("agent 管理")}</span>
        )}
      </div>

      <label className={labelCls}>
        {t("修改為(絕對路徑;留空 = 交給 agent 管理)")}
        <input
          className={`${inputCls} font-mono`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t("例:{path}", { path: "D:\\palworld\\my-server" })}
          disabled={!stopped}
        />
      </label>

      <p className="rounded-xl bg-card-soft px-3 py-2 text-xs text-ink-muted">
        {managed
          ? t("這個路徑由 agent 自動管理。")
          : t("你指定的伺服器安裝目錄。")}{" "}
        {t("改路徑不會搬移檔案。填既有的 PalServer 安裝目錄會直接採用;填空資料夾或新路徑則會在下次啟動時安裝到那裡;留空則回到 agent 管理的資料夾。")}
      </p>

      {!stopped && (
        <p className="rounded-xl bg-sun/10 px-3 py-2 text-xs font-bold text-sun">
          {t("請先停止伺服器再修改路徑。")}
        </p>
      )}
      {error && <p className={errorCls}>{error}</p>}
      {notice && (
        <p className="rounded-xl bg-grass/10 px-3 py-2 text-[13px] font-bold text-grass">{notice}</p>
      )}

      <div>
        <button className={`${btn} inline-flex items-center gap-1.5`} disabled={!stopped || !dirty || busy}>
          <FiSave className="size-4" /> {busy ? t("儲存中…") : t("儲存路徑")}
        </button>
      </div>
    </form>
  );
}

/** 刪除:必須輸入伺服器名稱與管理員密碼才放行,避免手滑刪掉整台伺服器。 */
function DangerZone({
  client,
  instanceId,
  name,
  adminPassword,
  onDeleted,
}: {
  client: AgentClient;
  instanceId: string;
  name: string;
  adminPassword: string;
  onDeleted: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [pwInput, setPwInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const nameOk = nameInput === name;
  const pwOk = pwInput === adminPassword;
  const canDelete = nameOk && pwOk && !busy;

  const del = async () => {
    if (!canDelete) return;
    setBusy(true);
    setError(null);
    try {
      await client.deleteInstance(instanceId);
      onDeleted();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setBusy(false);
    }
  };

  return (
    <div className={`${card} flex flex-col gap-3 border-berry/40`}>
      <h3 className="inline-flex items-center gap-2 text-sm font-extrabold text-berry">
        <FiAlertTriangle className="size-4" /> {t("刪除伺服器")}
      </h3>
      <p className="text-[13px] text-ink-muted">
        {t("移除這個伺服器實例。此動作無法復原。")}
        <b className="text-ink">{t("世界存檔會保留在磁碟上")}</b>
        {t(",不會一併刪除。")}
      </p>

      {!open ? (
        <div>
          <button
            className={`${btnDanger} inline-flex items-center gap-1.5`}
            onClick={() => setOpen(true)}
          >
            <FiTrash2 className="size-4" /> {t("刪除此伺服器…")}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3 rounded-xl border-2 border-berry/30 bg-berry/5 p-3">
          <p className="text-[13px] font-bold text-ink">
            {t("為確認,請輸入伺服器名稱與管理員密碼。")}
          </p>
          <label className={labelCls}>
            {t("伺服器名稱")}
            <input
              className={inputCls}
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder={name}
              autoComplete="off"
            />
          </label>
          <label className={labelCls}>
            {t("管理員密碼")}
            <input
              className={inputCls}
              type="password"
              value={pwInput}
              onChange={(e) => setPwInput(e.target.value)}
              autoComplete="off"
            />
            {adminPassword === "" && (
              <span className="text-xs font-normal text-ink-muted">
                {t("此伺服器未設定管理員密碼,密碼欄留空即可。")}
              </span>
            )}
          </label>
          {error && <p className={errorCls}>{error}</p>}
          <div className="flex gap-2">
            <button
              className={`${btnDanger} inline-flex items-center gap-1.5`}
              onClick={del}
              disabled={!canDelete}
            >
              <FiTrash2 className="size-4" /> {busy ? t("刪除中…") : t("永久刪除")}
            </button>
            <button
              className="rounded-full px-4 py-2 text-sm font-extrabold text-ink-muted hover:text-ink"
              onClick={() => {
                setOpen(false);
                setNameInput("");
                setPwInput("");
                setError(null);
              }}
            >
              {t("取消")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
