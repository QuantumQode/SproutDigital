# SproutDigital

## Keep TODO.md up to date (every prompt, every action)

`TODO.md` in the repo root is the owner's running list of things *they* need to decide or do. It is gitignored on purpose: this is a GitHub Pages site, and a committed TODO.md would be published publicly.

- **Start of every session:** read `TODO.md` so open items stay in view. If it's missing, recreate it with the same sections.
- **After every prompt or action**, before finishing your reply, update it:
  - Add anything new the owner has to decide or do: open questions you asked, manual steps (dashboards, accounts, keys, content, legal), PRs waiting for review or merge, and placeholders you left in the code.
  - When something gets done or decided, tick it off and move it to **Done** with the date (`- [x] YYYY-MM-DD: …`).
  - Rewrite items that have changed. Don't duplicate them.
  - Bump the `_Last updated:` date.
- Keep items short and actionable. Bold the lead, and include exact values, file paths or links the owner will need.
- It's only for the owner's tasks. Don't list Claude's own implementation steps.
- Never `git add` TODO.md or remove it from `.gitignore`.
- Mention in your reply when TODO.md changed (one line is enough), so the owner knows to check it.
