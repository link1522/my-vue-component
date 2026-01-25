# AtomicLink

## 為什麼需要 AtomicLink
    - 外部連結能自動落到 `<a>`
    - 安全性預設做好（`rel="noopener noreferrer"`）
	    - noopener: 切斷與原頁關係，新頁面拿不到 `window.opener`
		    - 新頁惡意把原本的頁面導去釣魚網站 (tabnabbing)
	    - noreferrer: 不送出 Referer
    - 甚至做「預先載入」改善切頁延遲

## Props 設計
    - `to: RouteLocationRaw`（預設 `''`）
    - `target?: string`
    - `external?: boolean`（預設 `false`）

## 判斷順序：
    - external === true → 一律外部
    - target 存在且 target !== '_self' → 外部（例如 _blank）
    - to 是 object（route 物件）→ 內部
    - to 是字串：
        - 無通訊協定 → 內部
        - 有通訊協定（如 https://，交給 ufo 的 hasProtocol）→ 外部
        （用工具減少 edge cases）

## href 解析策略
    - 若 to 是物件：用 router.resolve(to).href 轉成可用於 <a> 的網址
    - 否則：直接把 to 當 href

## 渲染策略（核心做法）
    - isExternal === false → 用 <RouterLink :to="to">
    - isExternal === true → 用 <a :href="href" :target="target" rel="noopener noreferrer">

## 進階功能：Smart Prefetching

當連結「進入視窗可見區」時，預先下載目標頁面的 lazy component，讓點擊切頁更快。

實作重點：

- `preloadRouteComponents(to, router)`：
    - `router.resolve(to)` 取得 `{ path, matched }`
    - 用 `router._routePreloaded: Set<string>` 記錄已 prefetch 的 `path`，避免重複載入
    - 從 `matched` 抓 `components.default`
    - 過濾出 function（lazy import）後逐一執行，`Promise.all` 等待（錯誤 catch 掉避免中斷）

觸發時機：

- 用 `IntersectionObserver` 觀察 link DOM
- 一旦可見：
    - 解除觀察並清理 observer
    - 若是外部連結則跳過
    - 否則呼叫 `preloadRouteComponents`

效能優化: 避免大量 IntersectionObserver