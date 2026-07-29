# E-Commerce Admin Dashboard with QA Test Center

一套以企業後台管理情境為核心的全端練習專案，整合使用者管理、角色權限、身分驗證、操作紀錄與後台資料篩選功能。

本專案不只實作基本 CRUD，而是以實際後台系統可能遇到的問題為出發點，練習前後端分離、權限驗證、資料安全、錯誤處理與可維護的程式架構。

---

## 專案介紹

E-Commerce Admin Dashboard 是一套提供內部管理人員使用的電商後台系統。

目前主要開發內容為 **Admin Users Management**，讓具有不同管理層級的使用者，可以依照自身權限執行：

* 查看後台使用者
* 搜尋及篩選使用者
* 建立新的管理帳號
* 編輯使用者資料
* 啟用或停用帳號
* 管理不同角色與權限
* 記錄重要操作行為
* 限制未登入使用者進入受保護頁面

專案後續將擴充商品、訂單、通知、Activity Logs 與 QA Test Center 等功能。

---

## 專案目標

此專案的目標不只是完成一個後台介面，而是建立接近實際產品開發流程的完整系統。

主要練習方向包含：

1. 建立可維護的前後端專案架構
2. 使用 TypeScript 管理資料型別
3. 設計 GraphQL API 與 Resolver
4. 實作 JWT 身分驗證
5. 實作前後端雙重權限驗證
6. 處理搜尋、角色及狀態等複合條件
7. 統一 API 錯誤格式
8. 建立操作紀錄與系統可追蹤性
9. 處理 Loading、Error 與 Empty Data 狀態
10. 模擬真實後台系統的開發與維護流程

---

## 主要功能

### Authentication

* 管理員登入與登出
* 使用 JWT 驗證使用者身分
* 驗證帳號是否存在
* 驗證帳號是否為啟用狀態
* 驗證密碼是否正確
* 未登入時禁止進入受保護頁面
* 登入後支援導回原本欲前往的頁面

### User Management

* 顯示所有後台使用者
* 透過姓名、Email 或 User ID 搜尋
* 根據角色篩選使用者
* 根據帳號狀態篩選使用者
* 支援搜尋條件與多個篩選條件組合
* 建立新的後台使用者
* 編輯使用者基本資料
* 啟用或停用使用者帳號
* 操作完成後同步更新列表資料

### Role and Permission

* 依照角色控制可執行的操作
* 使用 `manage_level` 判斷管理層級
* 防止低權限帳號管理高權限帳號
* 防止使用者停用或修改自己的重要權限
* 前端控制操作按鈕顯示
* 後端再次執行權限驗證，避免繞過前端限制

### UI States

* Loading 狀態
* API Error 狀態
* Empty Data 狀態
* 表單驗證錯誤提示
* 操作成功或失敗提示

### Activity Logs

* 記錄重要的管理操作
* 保存操作人員、操作類型、描述與時間
* 提高後台操作的可追蹤性

---

## 系統架構

```text
Frontend
   │
   │ GraphQL Request
   ▼
API Utility Layer
   │
   │ Authorization: Bearer Token
   ▼
Apollo Server
   │
   ├── GraphQL Schema
   ├── Resolver
   ├── Authentication Context
   ├── Permission Validation
   └── Error Handling
   │
   ▼
PostgreSQL / Supabase
```

身分驗證流程：

```text
取得 Access Token
        ↓
驗證 JWT Token
        ↓
取得 Token Payload 中的 User ID
        ↓
從資料庫取得使用者資料
        ↓
確認使用者存在且狀態為 Active
        ↓
將使用者資料加入 GraphQL Context
        ↓
Resolver 執行身分與權限驗證
```

---

## 使用技術

### Frontend

| Technology                 | Purpose           |
| -------------------------- | ----------------- |
| Next.js                    | 建立前端頁面、路由與應用程式架構  |
| React                      | 建立元件與管理互動狀態       |
| TypeScript                 | 管理資料型別並降低執行階段錯誤   |
| Tailwind CSS               | 建立後台 UI 與響應式版面    |
| React Hook Form            | 管理表單狀態與送出流程       |
| Zod                        | 表單資料驗證與 Schema 定義 |
| Lucide React / React Icons | 後台操作介面圖示          |
| Fetch API                  | 呼叫 GraphQL API    |
| Next.js Route Protection   | 保護需要登入的頁面         |

### Backend

| Technology     | Purpose                        |
| -------------- | ------------------------------ |
| Node.js        | 後端 JavaScript 執行環境             |
| Express        | 建立 HTTP Server                 |
| Apollo Server  | 建立 GraphQL Server              |
| GraphQL        | 定義 API Schema、Query 與 Mutation |
| TypeScript     | 管理 Resolver、Context 與資料型別      |
| PostgreSQL     | 儲存使用者、角色、權限與操作紀錄               |
| Supabase       | PostgreSQL Database Hosting    |
| JSON Web Token | 使用者身分驗證                        |
| bcrypt         | 密碼雜湊與密碼比對                      |
| pg / pg-pool   | 管理 PostgreSQL 連線               |

### Development Tools

| Tool           | Purpose                     |
| -------------- | --------------------------- |
| Git            | 版本控制                        |
| GitHub         | 原始碼管理與 Pull Request         |
| ESLint         | 程式碼品質檢查                     |
| Prettier       | 統一程式碼格式                     |
| Apollo Sandbox | 測試 GraphQL Query 與 Mutation |
| Postman        | API 測試                      |
| Playwright     | 規劃用於端對端測試                   |

---

## 解決的主要問題

### 1. 防止未登入使用者直接進入後台

後台頁面不能只依靠 UI 隱藏功能。

即使畫面上沒有顯示入口，使用者仍可能直接輸入 `/users` 等網址進入頁面。因此專案加入路由保護機制，在使用者進入受保護頁面前檢查登入狀態。

若沒有有效的 Access Token，使用者會被導向登入頁面。

---

### 2. 防止前端權限限制被繞過

前端隱藏按鈕只能改善使用者體驗，不能作為真正的安全機制。

攻擊者仍可能透過 Apollo Sandbox、Postman 或自行建立 HTTP Request 呼叫 API。

因此本專案在後端 Resolver 中再次驗證：

* 使用者是否已登入
* 使用者帳號是否有效
* 使用者是否具有操作權限
* 操作者的管理層級是否高於目標使用者
* 操作者是否正在操作自己的帳號

只有通過後端驗證，資料庫操作才會真正執行。

---

### 3. 處理複合搜尋與篩選條件

使用者列表需要同時支援：

* 關鍵字搜尋
* 角色篩選
* 狀態篩選
* All 選項
* 多個條件同時存在

前端會統一送出完整的 Filter Object，後端再根據參數是否為 `null`，決定是否加入限制條件。

```sql
WHERE
  (
    $1::text IS NULL
    OR u.name ILIKE '%' || $1 || '%'
    OR u.email ILIKE '%' || $1 || '%'
    OR u.id::text ILIKE '%' || $1 || '%'
  )
  AND (
    $2::bigint IS NULL
    OR u.role_id = $2
  )
  AND (
    $3::text IS NULL
    OR u.status = $3
  )
```

當角色或狀態選擇 `all` 時，前端會將其轉換成 `null`，代表該欄位不限制查詢結果。

---

### 4. 解決前後端資料型別不一致

在 API 串接過程中，曾遇到以下資料型別問題：

* HTML Select 回傳值固定為 `string`
* 資料庫中的 `role_id` 為 `bigint`
* User ID 使用 UUID
* GraphQL 的 `Int` 與 JavaScript Number 存在限制
* `null`、空字串與 `undefined` 的行為不同

透過 TypeScript、GraphQL Schema 與前端資料轉換，讓每一層資料型別保持一致。

例如：

```ts
const roleId = role === 'all' ? null : Number(role)
```

避免直接拿字串和數字比較，降低執行階段錯誤。

---

### 5. 建立統一的 API 錯誤處理

後端使用 GraphQL Error Code 統一管理錯誤類型，例如：

```text
UNAUTHENTICATED
UNAUTHORIZED
FORBIDDEN
USER_NOT_FOUND
EMAIL_ALREADY_EXIST
INVALID_INPUT_DATA
EMAIL_FORMAT_INVALID
ACTIVITY_LOGS_FAILED
```

前端可以依照 Error Code 顯示適合的提示，而不是直接將資料庫錯誤或伺服器內部訊息暴露給使用者。

---

### 6. 避免刪除重要使用者資料

後台帳號通常與操作紀錄、訂單或其他資料存在關聯。

直接刪除帳號可能造成：

* Activity Logs 無法對應使用者
* Foreign Key 錯誤
* 歷史操作紀錄遺失
* 稽核資料不完整

因此目前主要採用 Soft Delete 概念，透過 `active` 與 `inactive` 管理帳號狀態，而不是直接從資料庫移除使用者。

---

### 7. 維持操作後的列表資料一致

建立、編輯、啟用或停用帳號後，列表資料必須立即反映最新狀態。

專案將資料操作與列表重新取得流程分開處理：

```text
執行 Mutation
      ↓
確認操作成功
      ↓
重新取得符合目前 Filter 的使用者列表
      ↓
更新畫面狀態
```

這樣可以避免前端顯示資料與資料庫實際內容不一致。

---

## 資料庫設計

目前主要資料表包含：

### users

```text
id
name
email
password_hash
role_id
status
create_at
```

### roles

```text
id
code
manage_level
```

### permissions

```text
id
code
description
```

### role_permissions

```text
role_id
permission_id
```

### activity_logs

```text
id
user_id
action
description
create_at
```

---

## 專案目錄

```text
E-Commerce-Admin-Dashboard-with-QA-Test-Center
│
├── frontend
│   ├── app
│   ├── components
│   ├── features
│   ├── hooks
│   ├── lib
│   ├── types
│   └── utils
│
├── Backend
│   └── src
│       ├── graphql
│       ├── resolvers
│       ├── schemas
│       ├── services
│       ├── types
│       ├── utils
│       └── server.ts
│
└── README.md
```

實際目錄可能會隨開發進度調整。

---

## 本機啟動

### 1. Clone Repository

```bash
git clone <repository-url>
cd E-Commerce-Admin-Dashboard-with-QA-Test-Center
```

### 2. 安裝前端套件

```bash
cd frontend
npm install
```

### 3. 安裝後端套件

```bash
cd ../Backend
npm install
```

### 4. 設定環境變數

後端建立 `.env`：

```env
DATABASE_URL=
JWT_SECRET=
PORT=4000
```

前端建立 `.env.local`：

```env
NEXT_PUBLIC_GRAPHQL_API_URL=http://localhost:4000/graphql
```

請勿將實際的 Secret、Token 或 Database Password 上傳到 GitHub。

### 5. 啟動後端

```bash
cd Backend
npm run dev
```

### 6. 啟動前端

```bash
cd frontend
npm run dev
```

前端預設執行於：

```text
http://localhost:3000
```

GraphQL API 預設執行於：

```text
http://localhost:4000/graphql
```

---

## 目前開發進度

### 已完成或已實作

* [x] 後台登入介面
* [x] JWT 身分驗證流程
* [x] GraphQL Context 使用者注入
* [x] Users Table
* [x] 使用者搜尋功能
* [x] Role Filter
* [x] Status Filter
* [x] 複合條件查詢
* [x] 建立使用者 API
* [x] 編輯使用者 API
* [x] 啟用使用者 API
* [x] 停用使用者 API
* [x] 頁面保護機制
* [x] 後端角色與管理層級驗證
* [x] Activity Log 基礎功能

### 開發中

* [ ] Create User Modal
* [ ] Edit User Modal
* [ ] 列表分頁
* [ ] Loading State
* [ ] Error State
* [ ] Empty Data State
* [ ] 操作成功與失敗通知
* [ ] Reset Password
* [ ] 前後端權限顯示一致性
* [ ] Users Module 測試

### 後續規劃

* [ ] Dashboard Statistics
* [ ] Product Management
* [ ] Order Management
* [ ] Role Management
* [ ] Permission Management
* [ ] Activity Log Management
* [ ] Notification Center
* [ ] QA Test Center
* [ ] Playwright E2E Tests
* [ ] CI/CD
* [ ] Production Deployment

---

## 專案學習成果

透過本專案，我實際練習了：

* 使用 Next.js 與 React 建立後台管理介面
* 使用 TypeScript 設計前後端資料型別
* 使用 React Hook Form 與 Zod 管理表單驗證
* 使用 GraphQL 設計 Query、Mutation 與 Resolver
* 使用 Apollo Server 建立 GraphQL API
* 使用 PostgreSQL 撰寫 JOIN 與動態條件查詢
* 使用 JWT 與 bcrypt 建立登入驗證
* 將使用者資料加入 GraphQL Context
* 設計角色、權限與管理層級
* 實作前後端雙重權限保護
* 處理 API Loading、Error 與 Empty Data 狀態
* 建立統一錯誤碼與錯誤處理流程
* 使用 Git Branch 與 Pull Request 管理開發進度
* 從實際錯誤中除錯並改善系統架構

---

## 專案特色

此專案與單純 CRUD 練習最大的不同，在於加入了實際後台系統會遇到的設計問題：

* 身分驗證
* 路由保護
* 角色權限
* 管理層級
* 資料安全
* 複合條件查詢
* 操作紀錄
* 錯誤處理
* 前後端型別一致性
* 操作後資料同步
* 開發與正式環境分離

希望透過這個專案，展現從 UI、API、資料庫到系統權限設計的完整全端開發能力。

---

## Author

Developed by **Zhou White**

This project is built for learning, portfolio presentation, and full-stack development practice.
