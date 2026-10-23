# SEC-10｜Node 安全建置環境門檻（2026-10-23）

## For Yao

- 完成一份僅修改建置環境版本門檻的安全候選：原本允許已停止支援的 Node 20，現在改為接受已修補的 22／24／26 發行線。ELISA 計算邏輯、頁面、Cloudflare 設定與正式網站沒有修改。
- 在獨立工作區使用官方驗證過的 Node 24.22.1，修改前後 `npm run check` 均通過；每次 40/40 項測試。比對英文頁、繁中頁、可離線開啟的單一 HTML，SHA-256 均相同。
- **目前是 GitHub 獨立分支上的候選，不是正式部署。** 沒有需要瑤立即處理的動作。若後續流程準備合併到 `main`（會觸發 Cloudflare 自動建置），必須先經過獨立的合併／部署判斷。

## For Lex

### Baseline / scope

- Repository: `lexian-sy/elisa-pilot-dilution-planner`; clean public `main` at `d0948ff1a6d2b6e05b82db9a406918443346feaa`.
- Scope: `package.json` `engines.node` only; support current patched security release lines: `^22.23.4 || ^24.22.1 || ^26.12.1`.
- Rationale: official 2026-10-21 Node security releases; Node 20 is EOL. `engines.node` restricts future install/build tooling; it does **not** upgrade any machine or retroactively change deployed static bytes.
- GitHub security branch: `security/2026-10-23-node-lts-engine-floor`. No main mutation, DNS, Worker, secrets, provider requests, analytics, or real data.

### Verification

- Before: `npm run check` on Node 24.22.1 passed: 40 tests, build, JS syntax.
- After: `npm run check` on same Node passed: 40 tests, build, JS syntax.
- SHA-256 unchanged across before/after for `dist/index.html`, `dist/zh-tw/index.html`, `dist/elisa-pilot-dilution-planner.html`. No scientific calculation or public output change.
- `git diff --check` passed. Only tracked file changed in local source stage: `package.json`.
- The main repo and production deployments were not modified; proposed metadata only.

### Review / next step

- Treat the branch as Working and the current deployed public beta as unchanged. Review any impact of constraining allowed Node major/minor lines, then adopt via a **separately authorized** merge/deploy gate if suitable.
- Stop on unexpected additional source edits, package install mismatch, or any attempt to change the mathematical model, claims, payment, analytics, public domains, or Cloudflare without a new scope.
