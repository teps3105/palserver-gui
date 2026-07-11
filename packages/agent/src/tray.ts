import { spawn, type ChildProcess } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { DATA_DIR } from "./env.js";

/**
 * Windows 系統匣圖示 —— 取代雙擊後那個一直開著的主控台視窗,讓玩家一眼看到「引擎運作中」,
 * 並能從右鍵選單打開管理介面 / 看配對碼 / 結束。
 *
 * 刻意用 Windows 內建的 PowerShell + WinForms NotifyIcon,不引入原生模組或額外打包的 binary
 * (那些在 Node SEA 免安裝執行檔裡都很難處理)。腳本只需要三個參數:管理介面網址、配對碼、
 * 以及 agent 的行程 id —— 「結束」會直接終止該行程,「開介面」用預設瀏覽器開網址,都不需要
 * 回呼進 Node,所以是個獨立、單向的小程式。agent 正常結束時也會把它一起收掉。
 */

// 注意:PowerShell 5.1 只有在有 BOM 時才把 .ps1 當 UTF-8 讀,否則中文會亂碼 —— 寫檔時補上 BOM。
// 這裡刻意不用 PowerShell 的反引號逸出(`n 之類),以免和 TS 樣板字串的反引號打架。
const TRAY_PS1 = String.raw`param([string]$Url, [string]$Code, [int]$AgentPid)
$ErrorActionPreference = 'SilentlyContinue'
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$notify = New-Object System.Windows.Forms.NotifyIcon
$notify.Icon = [System.Drawing.SystemIcons]::Application
$notify.Text = 'palserver GUI 引擎運作中'
$notify.Visible = $true

$menu = New-Object System.Windows.Forms.ContextMenuStrip

$open = $menu.Items.Add('打開管理介面')
$open.add_Click({ Start-Process $Url })

$code = $menu.Items.Add('顯示配對碼')
$code.add_Click({
  [System.Windows.Forms.MessageBox]::Show('配對碼:' + $Code + '  (在別的裝置連線時輸入)', 'palserver GUI') | Out-Null
})

$menu.Items.Add((New-Object System.Windows.Forms.ToolStripSeparator)) | Out-Null

$quit = $menu.Items.Add('結束 palserver GUI')
$quit.add_Click({
  $notify.Visible = $false
  Stop-Process -Id $AgentPid -Force
  [System.Windows.Forms.Application]::Exit()
})

$notify.ContextMenuStrip = $menu
# 左鍵點圖示直接開介面
$notify.add_MouseClick({ if ($_.Button -eq [System.Windows.Forms.MouseButtons]::Left) { Start-Process $Url } })

# agent 行程若消失(自我更新、被關掉),系統匣圖示也跟著結束,避免留下孤兒圖示。
$timer = New-Object System.Windows.Forms.Timer
$timer.Interval = 3000
$timer.add_Tick({
  if (-not (Get-Process -Id $AgentPid -ErrorAction SilentlyContinue)) {
    $notify.Visible = $false
    [System.Windows.Forms.Application]::Exit()
  }
})
$timer.Start()

[System.Windows.Forms.Application]::Run()
$notify.Dispose()
`;

/**
 * 啟動系統匣圖示。只在 Windows 有效,其他平台回 null。盡力而為:失敗絕不影響 agent 本體
 * (回 null,呼叫端照常運作)。回傳的 ChildProcess 供 agent 結束時一併收掉。
 */
export function startTray(opts: { url: string; code: string }): ChildProcess | null {
  if (process.platform !== "win32") return null;
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const scriptPath = path.join(DATA_DIR, "tray.ps1");
    fs.writeFileSync(scriptPath, "﻿" + TRAY_PS1, "utf8");
    const child = spawn(
      "powershell",
      [
        "-NoProfile",
        "-NonInteractive",
        "-Sta", // NotifyIcon 需要 STA 執行緒 + 訊息迴圈
        "-WindowStyle",
        "Hidden",
        "-ExecutionPolicy",
        "Bypass",
        "-File",
        scriptPath,
        "-Url",
        opts.url,
        "-Code",
        opts.code,
        "-AgentPid",
        String(process.pid),
      ],
      { windowsHide: true, stdio: "ignore" },
    );
    child.on("error", () => {});
    return child;
  } catch {
    return null;
  }
}
