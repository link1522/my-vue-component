# AtomicButton

## 實踐按鈕樣式

- contained 實心填色
- outlined 外框/空心
- text 純文字

## 元件架構

- Prepend：前置 Icon
- Text：文字內容
- Append：後置

## 功能規格

- 支援原生按鈕屬性：type、disabled 等
- variant：定義外觀型態（contained / outlined / text）
- color：定義語意色系（primary / success / warning / danger / info）
- shape：定義形狀（rectangle 預設、circle、square）
- size：定義大小（normal、small）
- 支援前後 Icon（prepend/append）

## 實作核心：以 class 組合驅動樣式

- 用 computed 產生 root class，形成可預期的樣式組合：
  - atomic-button--{variant}
  - atomic-button--{color}
  - atomic-button--{shape}
  - atomic-button--{size}

## SCSS 與 CSS 變數的組合策略

1. variant × color：用 SCSS @each 產生組合
   - 建立 $color-map（語意色名 → 色碼），迴圈輸出各色在不同互動狀態下的背景/邊框等。
   - 同時處理 hover/focus/active 與 disabled 狀態，減少重複撰寫。

1. size × shape：用 CSS 變數減少組合爆炸
   - size class 只負責設定變數（--button-size, --button-padding）
   - shape class 使用變數決定 width/padding/border-radius
   - 優點：原本 6 種 size×shape 組合可減少硬寫的 CSS，且未來擴充尺寸或形狀更省工。

## Icon 的設計取捨：以 slot 為主

- props 傳 icon 名稱（需要維護 CSS 或名稱對應表，耦合高）
- props 傳 icon 元件（可用 vite-svg-loader，較解耦，但客製 props 需額外設計）
- slot（prepend/append）：最彈性，可自由控制 icon 與樣式（缺點是 template 稍微冗長） -> 作者偏好此方法

## 同一套外觀支援按鈕與連結

- 常見需求：「外觀像按鈕，但行為是換頁」。
- 為語意化、無障礙與 SEO，支援 to：
  - 未傳 to：渲染 <button>
  - 有傳 to：改渲染 <AtomicLink :to="to">
- 注意：<a> 不支援 disabled，因此只在渲染 button 時才套用 disabled/type。
