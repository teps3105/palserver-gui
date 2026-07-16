# palserver GUI — v2.3.0

排行榜與伺服器週報、世界樹地圖、圖鑑收集完成度、每日多時刻自動重啟;修復「排程自動重啟後伺服器停擺」與存檔掃描等級/IV 全空
Leaderboards & server digest, World Tree map, Paldeck completion, multi-time daily restarts; fixes the scheduled-restart hang and empty levels/IVs in save scans
ランキングとサーバーレポート、世界樹マップ、図鑑コンプ率、毎日複数時刻の自動再起動。スケジュール再起動後の停止不具合とセーブ解析(レベル/個体値)を修正

> 有開自動更新會自己抓,或依下方手動下載。
> The in-app updater fetches it automatically, or download below.
> 自動更新で取得、または下記から手動でダウンロード。

<details>
<summary><b>🇹🇼 繁體中文</b></summary>

### 新功能
- **排行榜分頁**(贊助者) — 等級榜、財富榜、最強帕魯榜(加權評分:等級+IV+星級+詞條,列出詞條明細)、公會綜合實力榜(平均等級/活躍成員/據點/駐守/研究多維比較);「**伺服器大事**」自動彙整新玩家、練級最快、新蓋據點與全服金錢趨勢曲線;可開啟「**每小時自動掃描**」累積歷史;各榜標題旁「?」可看計算方式。
- **圖鑑收集完成度** — 玩家詳情顯示已登錄/捕捉過的物種數與進度條(讀存檔,離線玩家也查得到)。
- **世界樹地圖** — 線上地圖新增「主世界/世界樹」切換:世界樹專屬底圖,附 7 隻 Alpha 頭目(含頭像與等級)、快速旅行/塔地標、80 個帕魯樹晶礦點;玩家位置依所在世界自動分流。
- **每天多時刻自動重啟**(贊助者;單一時刻免費) — 排程 UI 改版,準點觸發不漂移。
- **BOSS(頭目)帕魯** — 給予帕魯/自訂帕魯支援頭目版本。
- **簡體中文完整在地化** — 感謝 UCKETX 的大規模校對(PR #18、#33)。
- 自動重啟的遊戲內倒數公告改用介面語言(儲存「伺服器重啟」設定時寫入)。

### 修正
- **排程自動重啟後伺服器停擺** — 重啟流程沒等舊程序完全退出就宣告成功,新程序起不來,伺服器一路停到有人發現。有開排程重啟的島主請務必更新。
- **存檔掃描等級/IV 全空** — 三個解析問題一次修好(ByteProperty 欄位、共玩殘留的重複玩家實體蓋掉真身、新角色省略預設值):玩家詳情與排行榜的等級、個體值、星級現在都正確。更新後重掃一次生效。
- **埠管理**(感謝 teps3105,PR #29) — REST 埠改 1:1 對映(**docker 既有實例需 stop→remove→start 一次**);撞埠檢查跨欄位(遊戲埠/查詢埠同為 UDP、REST/RCON 同為 TCP);複製實例自動分配新埠;native 改世界設定即時寫回 ini。
- **社群修復**(感謝 BlackWhiteTW,PR #32) — 遺物指令補 RelicType 參數、自訂帕魯濃縮計算、UE4SS 測試版下載、等級上限 255、地圖 Z 軸座標。
- 其他 — 自訂帕魯「隨機詞條」可抽滿 8 條、濃縮數值上限防呆、手機版面(375px)排版修正。

</details>

<details>
<summary><b>🇨🇳 简体中文</b></summary>

### 新功能
- **排行榜页签**(赞助者) — 等级榜、财富榜、最强帕鲁榜(加权评分:等级+IV+星级+词条,列出词条明细)、公会综合实力榜(平均等级/活跃成员/据点/驻守/研究多维比较);「**服务器大事**」自动汇整新玩家、练级最快、新盖据点与全服金钱趋势曲线;可开启「**每小时自动扫描**」积累历史;各榜标题旁「?」可看计算方式。
- **图鉴收集完成度** — 玩家详情显示已登录/捕捉过的物种数与进度条(读存档,离线玩家也查得到)。
- **世界树地图** — 在线地图新增「主世界/世界树」切换:世界树专属底图,附 7 只 Alpha 头目(含头像与等级)、快速旅行/塔地标、80 个帕鲁树晶矿点;玩家位置按所在世界自动分流。
- **每天多时刻自动重启**(赞助者;单一时刻免费) — 排程 UI 改版,准点触发不漂移。
- **BOSS(头目)帕鲁** — 给予帕鲁/自定义帕鲁支持头目版本。
- **简体中文完整本地化** — 感谢 UCKETX 的大规模校对(PR #18、#33)。
- 自动重启的游戏内倒数公告改用界面语言(保存「服务器重启」设置时写入)。

### 修复
- **排程自动重启后服务器停摆** — 重启流程没等旧程序完全退出就宣告成功,新程序起不来,服务器一路停到有人发现。有开排程重启的岛主请务必更新。
- **存档扫描等级/IV 全空** — 三个解析问题一次修好(ByteProperty 字段、联机残留的重复玩家实体盖掉真身、新角色省略默认值):玩家详情与排行榜的等级、个体值、星级现在都正确。更新后重扫一次生效。
- **端口管理**(感谢 teps3105,PR #29) — REST 端口改 1:1 映射(**docker 既有实例需 stop→remove→start 一次**);撞端口检查跨字段(游戏端口/查询端口同为 UDP、REST/RCON 同为 TCP);复制实例自动分配新端口;native 改世界设置即时写回 ini。
- **社区修复**(感谢 BlackWhiteTW,PR #32) — 遗物指令补 RelicType 参数、自定义帕鲁浓缩计算、UE4SS 测试版下载、等级上限 255、地图 Z 轴坐标。
- 其他 — 自定义帕鲁「随机词条」可抽满 8 条、浓缩数值上限防呆、手机版面(375px)排版修正。

</details>

<details>
<summary><b>🇬🇧 English</b></summary>

### New
- **Leaderboard tab** (sponsors) — level, wealth, strongest-Pal (weighted score: level + IVs + stars + passives, with passive chips) and guild-power rankings (avg level / active members / bases / workers / research); a "**Server highlights**" digest of new players, fastest levelers, new bases and a server-wide money trend curve; optional **hourly auto-scan** to build history; a "?" beside each board explains the scoring.
- **Paldeck completion** — player details show registered/captured species count with a progress bar (from the save file; works for offline players too).
- **World Tree map** — the live map gains a Main world / World Tree switcher: dedicated World Tree base map with 7 Alpha bosses (portraits + levels), fast-travel/tower landmarks and 80 Paloxite nodes; player markers route to the world they're actually in.
- **Multiple daily restart times** (sponsors; a single daily time stays free) — reworked schedule UI, drift-free on-the-minute triggering.
- **BOSS Pals** — Give Pal / Custom Pal now support boss variants.
- **Complete Simplified-Chinese localisation** — thanks to UCKETX (PR #18, #33).
- In-game countdown announcements for automatic restarts now use your interface language (written when saving restart settings).

### Fixes
- **Server left stopped after a scheduled restart** — the restart flow declared success before the old process fully exited, so the new one never came up. If you use scheduled restarts, please update.
- **Empty levels/IVs in save scans** — three parsing issues fixed at once (ByteProperty fields, duplicate player entities from co-op imports shadowing the real one, defaults omitted for fresh characters): levels, IVs and stars in player details and leaderboards are now correct. Rescan once after updating.
- **Port management** (thanks teps3105, PR #29) — REST port is now mapped 1:1 (**existing docker instances need one stop → remove → start**); port-conflict checks now work across fields (game/query ports share UDP, REST/RCON share TCP); duplicating an instance auto-assigns fresh ports; native backends write world-setting changes to the ini immediately.
- **Community fixes** (thanks BlackWhiteTW, PR #32) — relic command RelicType parameter, custom-Pal condensing math, UE4SS beta downloads, level cap 255, map Z coordinates.
- Misc — Custom Pal "random passives" can roll up to 8, condensing count sanity cap, 375px mobile layout fixes.

</details>

<details>
<summary><b>🇯🇵 日本語</b></summary>

### 新機能
- **ランキングタブ**(スポンサー) — レベル/所持金/最強パル(加重スコア:レベル+個体値+星+パッシブ,パッシブも表示)/ギルド総合戦力(平均レベル/アクティブ/拠点/配備/研究の多面比較)。「**サーバーの出来事**」が新規プレイヤー・レベル上げ最速・新拠点・サーバー全体の所持金推移を自動集計。「**毎時自動スキャン**」で履歴を蓄積可能。各ランキングの「?」で計算方法を確認できます。
- **図鑑コンプ率** — プレイヤー詳細に登録/捕獲済み種数とプログレスバーを表示(セーブ読み取り,オフラインでも確認可)。
- **世界樹マップ** — ライブマップに「メインワールド/世界樹」切替を追加:世界樹専用ベースマップに 7 体のアルファパル(アイコン+レベル)、ファストトラベル/塔、パルキサイト 80 箇所を表示。プレイヤー位置は実際にいるワールドへ自動振り分け。
- **毎日複数時刻の自動再起動**(スポンサー;1 時刻は無料) — スケジュール UI を刷新、時刻ぴったりに発火。
- **BOSS(ボス)パル** — パル付与/カスタムパルがボス変種に対応。
- **簡体字中国語の完全ローカライズ** — UCKETX さんに感謝(PR #18、#33)。
- 自動再起動のゲーム内カウントダウン告知がインターフェース言語に対応(再起動設定の保存時に反映)。

### 修正
- **スケジュール再起動後にサーバーが停止したまま** — 旧プロセスの終了を待たずに成功と判定し、新プロセスが起動しない問題。スケジュール再起動をお使いの方は必ず更新してください。
- **セーブ解析でレベル/個体値が空** — 3 つの解析問題を一括修正(ByteProperty、協力プレイ移行の重複プレイヤー実体、新規キャラのデフォルト値省略):プレイヤー詳細とランキングのレベル/個体値/星が正しく表示されます。更新後に一度再スキャンしてください。
- **ポート管理**(teps3105 さん,PR #29) — REST ポートを 1:1 マッピングに変更(**既存の docker インスタンスは stop→remove→start が一度必要**);ポート競合チェックをフィールド横断に(ゲーム/クエリは UDP、REST/RCON は TCP);複製時は新ポートを自動割当;native はワールド設定変更を即 ini へ書き込み。
- **コミュニティ修正**(BlackWhiteTW さん,PR #32) — 遺物コマンドの RelicType、カスタムパルの濃縮計算、UE4SS ベータ版ダウンロード、レベル上限 255、マップ Z 座標。
- その他 — カスタムパルの「ランダムパッシブ」が最大 8 個に、濃縮数の上限ガード、モバイル(375px)レイアウト修正。

</details>
