# palserver GUI — v2.2.2

Hotfix:重灌在 Windows 遇唯讀檔失敗、首頁名稱/埠不同步世界設定、給予道具/帕魯無法用簡中搜尋
Hotfix: reinstall failing on read-only files (Windows), home cards not syncing name/port from world settings, give item/pal search not matching Simplified Chinese
Hotfix:再インストールが読み取り専用ファイルで失敗(Windows)、ホームのサーバー名/ポートがワールド設定と同期しない、アイテム/パル付与の簡体字検索

> 有開自動更新會自己抓,或依下方手動下載。
> The in-app updater fetches it automatically, or download below.
> 自動更新で取得、または下記から手動でダウンロード。

<details>
<summary><b>🇹🇼 繁體中文</b></summary>

### 修正
- **重灌伺服器在 Windows 失敗**(`EPERM: unlink dbghelp.dll`)— 遊戲檔案偶有唯讀屬性、防毒也會短暫鎖檔;刪除改為自動重試並清除唯讀屬性。
- **首頁的伺服器名稱與遊戲埠不同步世界設定** — 改世界設定的 `ServerName`/`PublicPort` 後,首頁卡片與實際啟動埠現在會跟著更新(改埠會先檢查與其他實例撞埠)。
- **給予道具/帕魯的下拉選單無法用簡體中文搜尋** — 現在四語(英/繁/簡/日)名稱都能比對。

</details>

<details>
<summary><b>🇨🇳 简体中文</b></summary>

### 修复
- **重装服务器在 Windows 失败**(`EPERM: unlink dbghelp.dll`)— 游戏档案偶有只读属性、杀毒软件也会短暂锁档;删除改为自动重试并清除只读属性。
- **首页的服务器名称与游戏端口不同步世界设定** — 改世界设定的 `ServerName`/`PublicPort` 后,首页卡片与实际启动端口现在会跟着更新(改端口会先检查与其他实例冲突)。
- **给予道具/帕鲁的下拉菜单无法用简体中文搜索** — 现在四语(英/繁/简/日)名称都能匹配。

</details>

<details>
<summary><b>🇬🇧 English</b></summary>

### Fixes
- **Reinstall failing on Windows** (`EPERM: unlink dbghelp.dll`) — game files can carry the read-only attribute and antivirus may briefly lock them; deletion now retries and clears read-only attributes automatically.
- **Home cards not syncing server name / game port from world settings** — changing `ServerName`/`PublicPort` in world settings now updates the home card and the actual launch port (port changes are checked against other instances first).
- **Give item / give pal dropdowns not matching Simplified Chinese** — search now matches names in all four languages (EN / Traditional / Simplified / Japanese).

</details>

<details>
<summary><b>🇯🇵 日本語</b></summary>

### 修正
- **Windows で再インストールが失敗**(`EPERM: unlink dbghelp.dll`)— ゲームファイルの読み取り専用属性やウイルス対策ソフトの一時ロックが原因。削除時に自動リトライ+読み取り専用属性の解除を行うようにしました。
- **ホームのサーバー名/ポートがワールド設定と同期しない** — ワールド設定の `ServerName`/`PublicPort` を変更すると、ホームカードと実際の起動ポートも追従します(ポート変更は他インスタンスとの競合を事前チェック)。
- **アイテム/パル付与のドロップダウンが簡体字で検索できない** — 4 言語(英/繁体/簡体/日本語)の名前すべてで検索できるようになりました。

</details>
