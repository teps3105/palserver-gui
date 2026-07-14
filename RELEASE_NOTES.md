# palserver GUI — v2.1.0

舊存檔搬家一條龍:匯入存檔 + 一鍵修復主機角色(含新版存檔格式),再加上簡體中文與一大票品質改進
Bring your old worlds home: save import + one-click host-character fix (new save format supported), plus Simplified Chinese and a pile of QoL
旧ワールドの引っ越しがワンストップに:セーブインポート + ホストキャラクター修復(新セーブ形式対応)、簡体字中国語ほか多数改善

> 有開自動更新會自己抓,或依下方手動下載。
> The in-app updater fetches it automatically, or download below.
> 自動更新で取得、または下記から手動でダウンロード。

<details>
<summary><b>🇹🇼 繁體中文</b></summary>

### 舊玩家搬家
- **匯入存檔** — 「建立伺服器」旁的新按鈕。三種來源:其他專用伺服器、本機共玩存檔(四人邀請碼)、舊版 1.0 GUI。把存檔或伺服器資料夾路徑貼上、掃描、選世界,建立伺服器時自動帶入並設為啟用世界;匯入前自動備份。
- **修復主機角色(內建 palworld-host-save-fix)** — 共玩存檔搬上專用伺服器後,主機玩家會被要求重建角色。現在存檔備份分頁偵測到共玩主機檔就會出現「修復主機角色」:主機加入一次 → 停機 → 一鍵過戶,免裝 Python、免跑指令。修復前強制自動備份。
- **支援新版存檔格式(PlM / Oodle)** — 新版遊戲改用 Oodle 壓縮存檔,修復工具首次遇到會自動下載解壓元件(SHA-256 驗證),無感支援。
- 匯入後新加入的玩家角色檔會標「**匯入後新增**」並自動預選 —— 不用猜哪個檔是主機的新角色。

### 新功能
- **簡體中文介面** — 語言選單新增简体中文,全產品翻譯。
- **安裝進度條** — 下載伺服器檔案時,首頁卡片與實例頁都顯示即時百分比,不用再開日誌盯進度。
- **頻寬上限大放寬** — 引擎微調的每位玩家頻寬上限從 1.6 Mbps 拉到 1 Gbps,並即時換算顯示 Mbps;玩家載入與切換地圖可以快很多(注意總上行 ≈ 每人上限 × 人數)。
- **贊助碼換機自助化** — 在舊伺服器移除識別碼(或換貼新碼)會自動解綁,直接在新機啟用,不用再找管理員。

### 修正
- **RandomizerSeed 寫出無引號數字**導致「missing opening symbol」解析錯誤 — 改回官方字串格式,舊的壞值自動修復。(感謝社群回報)
- **重啟前確保存檔安全** — 感謝 @teps3105 貢獻(#17)。
- 一次訂閱偶爾收到兩張贊助碼(伺服端競態)已修正。
- 存檔備份分頁即時刷新 — 玩家加入產生的新角色檔 10 秒內自動出現。
- 重啟紀錄的事件內容補上英日翻譯;連線頁不再顯示你的公開 IP(避免截圖外洩);介面排版對齊微調。

</details>

<details>
<summary><b>🇨🇳 简体中文</b></summary>

### 老玩家搬家
- **汇入存档** — 「创建服务器」旁的新按钮。三种来源:其他专用服务器、本机共玩存档(四人邀请码)、旧版 1.0 GUI。把存档或服务器文件夹路径粘贴、扫描、选世界,创建服务器时自动带入并设为启用世界;汇入前自动备份。
- **修复主机角色(内置 palworld-host-save-fix)** — 共玩存档搬上专用服务器后,主机玩家会被要求重建角色。现在存档备份页检测到共玩主机文件就会出现「修复主机角色」:主机加入一次 → 停机 → 一键过户,免装 Python、免跑命令。修复前强制自动备份。
- **支持新版存档格式(PlM / Oodle)** — 新版游戏改用 Oodle 压缩存档,修复工具首次遇到会自动下载解压组件(SHA-256 校验),无感支持。
- 汇入后新加入的玩家角色文件会标「**汇入后新增**」并自动预选。

### 新功能
- **简体中文界面** — 语言菜单新增简体中文,全产品翻译。
- **安装进度条** — 下载服务器文件时,首页卡片与实例页都显示实时百分比。
- **带宽上限大放宽** — 引擎微调的每位玩家带宽上限从 1.6 Mbps 拉到 1 Gbps,并实时换算显示 Mbps;玩家加载与切换地图可以快很多(注意总上行 ≈ 每人上限 × 人数)。
- **赞助码换机自助化** — 在旧服务器移除识别码会自动解绑,直接在新机启用。

### 修复
- **RandomizerSeed 写出无引号数字**导致「missing opening symbol」解析错误 — 改回官方字符串格式,旧的坏值自动修复。
- **重启前确保存档安全** — 感谢 @teps3105 贡献(#17)。
- 一次订阅偶尔收到两张赞助码已修复;存档备份页实时刷新;连接页不再显示你的公网 IP;界面排版微调。

</details>

<details>
<summary><b>🇬🇧 English</b></summary>

### Bring your old worlds home
- **Import save** — a new button next to "Create server". Three sources: another dedicated server, a local co-op (invite-code) save, or the legacy 1.0 GUI. Paste the save or server folder path, scan, pick the world — it's pulled in and set active when the server is created, with an automatic backup first.
- **Fix host character (palworld-host-save-fix, built in)** — after moving a co-op save to a dedicated server, the host gets asked to create a new character. The Backups tab now detects the co-op host file and offers a one-click transfer: host joins once → stop → fix. No Python, no command line, and the whole world is backed up automatically first.
- **New save format supported (PlM / Oodle)** — recent game versions compress saves with Oodle; the fixer downloads a decompression component on first use (SHA-256 verified) and just works.
- Player files created after an import are tagged "**Added after import**" and preselected — no guessing which file is the host's new character.

### New
- **Simplified Chinese UI** — full product translation.
- **Install progress bar** — live percentage on the dashboard card and instance page while server files download.
- **Much higher bandwidth caps** — per-player cap in Engine Tuning raised from 1.6 Mbps to 1 Gbps, with a live Mbps readout; loading and map transitions can be much faster (mind: total upload ≈ per-player cap × players).
- **Self-service sponsor-code moves** — removing the code on the old server unbinds it automatically; activate on the new machine without admin help.

### Fixes
- **RandomizerSeed written unquoted**, causing the "missing opening symbol" parse error — now matches the official quoted-string format; old bad values self-heal. (Thanks for the community report!)
- **Save safety before restarts** — thanks @teps3105 (#17).
- Occasional duplicate sponsor codes per subscription fixed; Backups tab now live-refreshes (new player files appear within ~10 s); your public IP is no longer displayed on the connection page; restart-history entries are now translated; minor layout alignment.

</details>

<details>
<summary><b>🇯🇵 日本語</b></summary>

### 旧ワールドの引っ越し
- **セーブデータをインポート** — 「サーバーを作成」の隣に新ボタン。移行元は 3 種:他の専用サーバー、ローカル協力プレイ(招待コード)のセーブ、旧版 1.0 GUI。セーブまたはサーバーフォルダのパスを貼り付けてスキャンし、ワールドを選ぶだけ。作成時に自動で取り込み・アクティブ化、事前バックアップも自動です。
- **ホストキャラクター修復(palworld-host-save-fix を内蔵)** — 協力プレイのセーブを専用サーバーへ移すとホストはキャラクター再作成を求められますが、セーブバックアップタブがホストファイルを検出して修復ボタンを表示:ホストが一度参加 → 停止 → ワンクリックで引き継ぎ。Python もコマンドも不要、実行前に自動バックアップ。
- **新セーブ形式(PlM / Oodle)対応** — 新しいバージョンのセーブは Oodle 圧縮。初回に解凍コンポーネントを自動ダウンロード(SHA-256 検証)して対応します。
- インポート後に増えたプレイヤーファイルには「**インポート後に追加**」バッジが付き、自動で事前選択されます。

### 新機能
- **簡体字中国語 UI** — 全体を翻訳。
- **インストール進捗バー** — サーバーファイルのダウンロード中、ダッシュボードとインスタンスページに進捗率をリアルタイム表示。
- **帯域上限を大幅緩和** — エンジンチューニングの 1 人あたり帯域上限を 1.6 Mbps → 1 Gbps に。Mbps 換算も併記。ロードやマップ切替が大幅に速くなります(合計上り ≈ 上限 × 人数に注意)。
- **スポンサーコードの引っ越しがセルフサービスに** — 旧サーバーでコードを削除すると自動で解除され、新しいマシンでそのまま有効化できます。

### 修正
- **RandomizerSeed が引用符なしで書き出され**「missing opening symbol」エラーになる問題 — 公式の文字列形式に修正、既存の不正値も自動復旧。
- **再起動前のセーブ保護** — @teps3105 さんの貢献(#17)。
- 1 回の購読でスポンサーコードが 2 通届くことがある問題を修正;セーブバックアップタブが自動更新に;接続ページにパブリック IP を表示しないように;再起動履歴の英日訳を追加;レイアウト微調整。

</details>
