# ContentCraft

A responsive React frontend for an AI-powered content creation and marketing workspace, reconstructed from the supplied ContentCraft UI exports. It includes five distinct marketing screens, two authentication screens and nine workspace screens. All interfaces are real components, not screenshot backgrounds.

**Frontend demonstration:** authentication, AI generation, integrations, team invitations and analytics use clearly identified local demo behavior. No backend, OAuth provider, payment service, AI API or publishing channel is connected.

## Quick start

Requirements: **Node.js 22.12 or later** and npm. Node 22 is used for verification and CI.

```sh
git clone https://github.com/WT-QuyPhong/capstone1.git
cd capstone1
npm ci
npm run dev
```

Open Vite's printed URL (normally `http://127.0.0.1:5173`). On PowerShell use `npm.cmd` if execution policy blocks `npm.ps1`. The dashboard can be explored directly at `/dashboard`.

Demo sign-in accepts a valid email and a password of at least eight characters. Registration also validates full name, password confirmation and agreement. Passwords are **never saved or sent**. Remember-me stores only demo display name/email; Google sign-in explains that OAuth is unavailable before offering demo access.

## Commands

| Command                     | Purpose                           |
| --------------------------- | --------------------------------- |
| `npm install`               | Install or refresh dependencies   |
| `npm ci`                    | Reproduce the locked installation |
| `npm run dev`               | Start Vite locally                |
| `npm run build`             | Type-check and build into `dist/` |
| `npm run preview`           | Preview the production build      |
| `npm run lint`              | ESLint                            |
| `npm run test --if-present` | Vitest unit tests                 |
| `npm run test:e2e`          | Playwright browser tests          |
| `npm run format`            | Format source/configuration       |
| `npm run format:check`      | Check formatting                  |

Install the browser once before E2E tests:

```sh
npx playwright install chromium
npm run test:e2e
```

Playwright starts/reuses a server on port 5185. To use installed Edge on Windows:

```powershell
$env:PLAYWRIGHT_CHANNEL = "msedge"
npm.cmd run test:e2e
```

Tests use isolated browser contexts and sample data. Reports, traces, screenshots, dependencies, builds, real `.env` files and large reference exports are excluded from Git.

## Technology

React, TypeScript, Vite, Tailwind CSS 4, React Router, Lucide React, Recharts, React Hook Form, Zod, React Context, Fetch API, ESLint, Prettier, Vitest and Playwright. Tailwind is integrated through its Vite plugin; scoped styles reproduce the detailed reference layouts. Manrope fonts and original SVG illustrations are bundled locally.

## Screens and routes

| Screen              | Route                       | Frontend functionality                                                              |
| ------------------- | --------------------------- | ----------------------------------------------------------------------------------- |
| Features / landing  | `/`, `/features`            | Capability suite, draft copy/variation, workflow dialogs and CTAs                   |
| Integrations        | `/integrations`             | Search/categories, connection explanations and demo requests                        |
| Built For           | `/built-for`                | Audience groups, use-case dialogs, conversion sections                              |
| Resources           | `/resources`                | Search/filter, resource details, archive, local newsletter demo                     |
| Promotional landing | `/get-started`              | Distinct “Create smarter. Grow faster.” page and email handoff                      |
| Sign in             | `/login`                    | Validation, password visibility, remember-me, demo entry                            |
| Sign up             | `/register`                 | Name/email/password/confirmation/agreement validation                               |
| Dashboard           | `/dashboard`                | Quick actions, recent records, notifications/account dialogs                        |
| Products            | `/dashboard/products`       | Validated CRUD, search, status/category filters                                     |
| Brands              | `/dashboard/brands`         | Context/voice/color forms, search, JSON import                                      |
| Target customers    | `/dashboard/audiences`      | Persona CRUD, traits, filters and JSON import                                       |
| AI Content Studio   | `/dashboard/content-studio` | Brand/product/audience selectors, VI/EN templates, edit/copy/save/approval          |
| Image Studio        | `/dashboard/image-studio`   | Prompt/style/ratio, reference preview, local illustration, save/download/fullscreen |
| Content history     | `/dashboard/history`        | Persistent records, search/status filters, detail/status/delete and CSV export      |
| Analytics           | `/dashboard/analytics`      | Recharts, date-range datasets, breakdown and CSV export                             |
| Administration      | `/dashboard/admin`          | Local members, roles/status, demo invitations, usage/audit and SSO explanation      |
| Not Found           | Unknown URLs                | Working home return path                                                            |

All visible navigation links respond. Pricing, privacy, terms, support and service entry points without full reference screens use relevant informational dialogs or Resources instead of invented unrelated screens.

## Project structure

```text
capstone1/
├── .github/workflows/       # Existing Codex automation + frontend CI
├── docs/                   # Design analysis, verification, automation guide
├── public/assets/          # Original SVG illustrations
├── src/
│   ├── components/ui.tsx   # Fields, buttons, badges, dialogs, empty/loading states
│   ├── contexts/           # Auth, toast and workspace state
│   ├── layouts/            # Public and dashboard layouts
│   ├── mocks/seed.ts       # Representative records
│   ├── pages/
│   │   ├── public/         # Five marketing views
│   │   ├── auth/           # Login/register
│   │   └── dashboard/      # Management, studios, history, analytics
│   ├── routes/paths.ts     # Route constants
│   ├── services/           # Mock generation and fetch client
│   ├── styles/             # Tokens, primitives, responsive shell
│   ├── types/              # Domain interfaces
│   ├── utils/              # Validated browser persistence
│   ├── App.tsx             # Lazy routes and error boundary
│   └── main.tsx
├── tests/{unit,e2e}/
├── .env.example
├── index.html
├── package.json
├── package-lock.json
├── playwright.config.ts
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

## Demo data and limitations

- `contentcraft-workspace-v1` stores workspace records in localStorage. Zod validates persisted data and recovers malformed data with examples.
- `contentcraft-demo-session` stores name/email in localStorage when remembered, otherwise sessionStorage. It is not a real authenticated session; dashboard routes are intentionally accessible for demonstrations.
- Newsletter, feedback, integration requests and member audit entries are browser-local. No subscription or invitation email is sent.
- Text is composed from local templates and chosen context. Image generation returns the same local SVG illustration; prompts, styles and uploaded references demonstrate configuration, not a working image model.
- Editing saved approved copy produces an unsaved Draft and preserves the approved record. This is not a server-side immutable revision/audit system.
- Analytics are representative datasets, with local date-range changes. No live channel measurement occurs.
- Saved edits survive reloads at the same browser origin. Unsaved forms may reset on navigation. Data does not synchronize between accounts, origins or devices.
- Local member roles are UI controls, not enforced authorization. A linked brand cannot be deleted while products reference it; the last active administrator cannot be removed or demoted.
- Browser storage has quota/privacy limits. Do not store sensitive information in the demo. Back up desired records before clearing storage; removing `contentcraft-workspace-v1` and reloading resets examples.

## Environment and backend integration

Optional `.env.local` configuration (see `.env.example`):

```dotenv
VITE_API_BASE_URL=/api/v1
```

All `VITE_*` variables are public. Never put provider keys, OAuth secrets or database passwords in frontend variables. The GitHub Actions `OPENAI_API_KEY` below belongs only to the runner and is not needed to run this application.

`src/services/api.ts` provides `apiRequest<T>()` and `ApiError`, with cookie credentials. Setting its base URL does not automatically replace demo behavior. To connect a backend:

1. Agree on DTOs and endpoints for brands, products, audiences, content, generation jobs, metrics and membership.
2. Replace context mutations with typed requests and server persistence, maintaining loading/empty/failure states.
3. Replace `services/demo.ts` with backend job creation/status polling; keep provider credentials on that backend.
4. Implement authentication/OAuth callbacks, secure session cookies, logout and password recovery on the server. Client routes and roles are not security boundaries.
5. Upload images to an authorized backend asset store rather than browser previews.
6. Map exact version IDs, approvals, source/reporting periods, concurrent updates and audit events before using real team data.

Suggested integration domains are `/auth`, `/brands`, `/products`, `/audiences`, `/generations`, `/content`, `/analytics`, `/admin`. This repository does not implement those server endpoints.

## Production hosting

Deploy `dist/` after `npm run build`. Configure **SPA history fallback** so non-asset paths such as `/dashboard/history` return `index.html`. `npm run preview` is a local build preview, not a production server. Public hosting and a live backend are outside this source-delivery task.

Frontend CI runs locked installation, lint, build and unit tests on pushes/PRs to `main`. [Verification results](docs/VERIFICATION.md) record the actual checks performed.

## Design accuracy

All 16 identifiable screens were inspected individually, with relevant 2x details. See [screen inventory and checklist](docs/DESIGN_ANALYSIS.md). The references contain no editable Figma components, exact font file or standalone photographs. Manrope and original SVG product/editorial illustrations approximate missing assets; no pixel-perfect photographic equivalence is claimed.

Marketing statistics describe the supplied conceptual design, not measured service guarantees. The authentication panel uses a local-workspace label in place of an unverified compliance certification. Live AI, OAuth, publishing, billing, email, real analytics and backend RBAC remain future integrations.

The original automation guide is also preserved in [GITHUB_ACTIONS.md](docs/GITHUB_ACTIONS.md).

## Giao việc cho AI trên GitHub

Workflow [Codex coding task](https://github.com/WT-QuyPhong/capstone1/actions/workflows/codex-task.yml) nhận yêu cầu, sửa code và đẩy kết quả lên nhánh mới `codex/task-<run-id>-<attempt>`. Workflow tạo pull request dạng draft nếu GitHub cho phép. Mỗi lượt bắt đầu từ một commit xác định; workflow không tự merge kết quả.

### Thiết lập một lần

1. Tạo OpenAI API key trong [OpenAI Platform](https://platform.openai.com/api-keys).
2. Vào [Settings → Secrets and variables → Actions](https://github.com/WT-QuyPhong/capstone1/settings/secrets/actions), chọn **New repository secret**. Đặt tên `OPENAI_API_KEY` và dán khóa vào phần Secret. Không gửi khóa trong chat, Issue hay code.
3. Để AI tự mở pull request, vào [Settings → Actions → General](https://github.com/WT-QuyPhong/capstone1/settings/actions), bật **Allow GitHub Actions to create and approve pull requests**. Nếu tùy chọn này bị tắt, workflow vẫn đẩy code lên nhánh và cung cấp liên kết trong trang kết quả.

Workflow dùng OpenAI API; cần tài khoản API có quyền sử dụng và hạn mức phù hợp. Kết nối GitHub của cuộc chat và khóa API dùng trên runner là hai phần riêng.

### Cách 1: Gửi yêu cầu bằng Issue

Tạo hoặc mở một [GitHub Issue](https://github.com/WT-QuyPhong/capstone1/issues), rồi dùng tài khoản `WT-QuyPhong` đăng **comment mới** như sau:

```text
/codex Tạo trang đăng nhập responsive, thêm kiểm tra email và mật khẩu.
```

Lệnh phải bắt đầu bằng `/codex `, theo sau là yêu cầu. Nội dung Issue không tự gửi cho AI; hãy viết đủ thông tin trong comment. Workflow nhận comment trên Issue, không nhận comment trên pull request. Comment của tài khoản khác sẽ không chạy AI.

Mỗi comment mới tạo một lượt chạy và một nhánh mới từ nhánh mặc định. Sửa comment cũ không chạy lại tác vụ.

### Cách 2: Run workflow

Mở [Codex coding task](https://github.com/WT-QuyPhong/capstone1/actions/workflows/codex-task.yml), chọn **Run workflow** trên `main`, nhập `task` và `base_branch`, rồi chạy. `base_branch` phải là nhánh đã tồn tại; mặc định là `main`.

Bạn cũng có thể yêu cầu cuộc chat có kết nối GitHub đăng comment `/codex ...` lên một Issue cụ thể để giao việc cho workflow.

### Xem kết quả

Mở [Actions](https://github.com/WT-QuyPhong/capstone1/actions) → lượt chạy → **Summary** để xem liên kết nhánh và pull request. Artifact `codex-result-...` chứa patch và báo cáo của AI, được giữ 7 ngày. Nếu AI không thay đổi file nào, workflow chỉ lưu báo cáo.

Repo đã có mã nguồn frontend ContentCraft. Mô tả rõ màn hình và hành vi cần sửa khi giao yêu cầu cho AI.

Workflow tách bước AI có quyền đọc GitHub khỏi bước đẩy code có quyền ghi. Job đẩy code không thực thi script sinh bởi AI. Các thay đổi trong `.github/`, `.git/` và file `.env` thực bị chặn; mẫu `.env.example`, `.env.sample`, `.env.template` được phép. Các tác vụ chỉnh workflow hoặc cấu hình bí mật cần thực hiện riêng trong cuộc chat.

Tài liệu: [Codex GitHub Action](https://learn.chatgpt.com/docs/github-action).
