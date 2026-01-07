# Development Steps

## 1) Project Setup
- Install dependencies: `npm install`; ensure `npm start` launches the app (add `"start": "vite"` or `"start": "npm run dev"` in `package.json`).
- Add `npm test` script that runs Jest (optionally add an alias like `start:test` if you want a `npm run start:test` command to mirror the rubric wording “npm start test”).
- Remove Vite starter content in `src/App.jsx`, `src/App.css`, and `src/assets`; create clean layout scaffolding.
- Add dependencies: `react-router-dom` for routing and **@reduxjs/toolkit + react-redux** for state management (required by rubric).
- Update `README.md` with project description plus clear install and launch steps (`npm install`, `npm start`, and `npm start test` for tests).

## 2) Data Layer
- Place `_DATA.js` in `src/api/` and export helpers `_getUsers`, `_getQuestions`, `_saveQuestion`, `_saveQuestionAnswer`.

## 3) State Management
- Configure store with slices: `auth` (`authedUser`), `users`, `questions`, and `ui` (loading/error flags). The Redux store is the single source of truth; components derive data via selectors only.
- Thunks:
  - `bootstrapApp` -> fetch users/questions in parallel.
  - `login(userId)` / `logout()`.
  - `saveAnswer({ authedUser, qid, answer })` -> updates both `questions` and `users`.
  - `saveQuestion({ optionOneText, optionTwoText })` -> uses `authedUser` as author, injects timestamp, and adds to lists.
- Persist `authedUser` in local storage during store init; clear on logout.
- No component makes direct `_DATA` calls; all updates dispatch actions to reducers.

## 4) Routing
- Set up routes: `/login`, `/`, `/questions/:id`, `/add`, `/leaderboard`, `*` (Not Found).
- Create a `ProtectedRoute` wrapper to redirect to `/login` with `redirectTo` state; any typed path requires login first.
- Invalid poll id flow: if unauthenticated, redirect to login; after login, show Not Found for missing polls.
- Update document titles per route (e.g., Home, Leaderboard, Would You Rather).

## 5) Layout & Components
- Global shell: header nav visible on all pages (including Login and 404), main content container, and footer/metadata line.
- Shared components: `Button`, `Card`, `Avatar`, `Tabs`, `InputField`, `RadioCard`, `ScoreBadge`, `EmptyState`, and `Spinner`.
- Apply the design tokens from `docs/design-spec.md` in a `design-tokens.css` (CSS variables) plus global typography styles.

## 6) Page Implementation
- **Login**: list users with avatar + name, search/filter optional; select user to log in.
- **Home**: fetch on mount if not hydrated; render Active (default)/Completed tabs; show logged-in user name; each poll card links to detail; ensure correct categorization and movement to Completed after answering.
- **Poll Detail**: handle missing `qid`, show vote form or results; block double-submission; show success/failure banners; update counts and "Your vote"; ensure answered polls reflect on Home and Leaderboard.
- **New Poll**: controlled inputs with validation; disable submit during pending; redirect to Home->Active after success; ensure new poll appears in correct category for author.
- **Leaderboard**: compute `created` and `answered` counts from state; derive `score`; map to ranked list in descending score order.

## 7) Error, Loading, and Empty States
- Global bootstrap spinner; localized spinners for save actions; disable buttons while pending.
- Standardized inline error component with retry callback.
- Empty-state illustrations/messages for tabs with no polls.

## 8) Testing
- Maintain at least **10 passing Jest tests** runnable via `npm test`.
- Required `_DATA` tests:
  - Async test: `_saveQuestion` returns saved question with all expected fields for valid input.
  - Async test: `_saveQuestion` rejects with an error for invalid input.
  - Async test: `_saveQuestionAnswer` returns true for valid input.
  - Async test: `_saveQuestionAnswer` rejects with an error for invalid input.
- UI tests with React Testing Library:
  - At least one snapshot test (`toMatchSnapshot`) for a rendered component.
  - At least one DOM test using `fireEvent` (e.g., clicking vote submits and updates UI).
  - Routing protection redirects to login.
  - Active vs Completed list rendering based on mocked state.
  - Voting flow updates counts, moves poll to Completed, and marks "Your vote".
  - New poll submission adds a card to Active on home after redirect.
- Optional: slice reducer tests for `saveAnswer` and `saveQuestion` beyond the required API tests.

## 9) QA & Linting
- Run `npm run lint` before commits; fix warnings.
- Manual QA on mobile widths (375px), tablet (768px), and desktop (1280px+).
- Confirm refresh behavior on deep links and logout/login flows.

## 10) Delivery
- Update `README.md` with project description, install/launch/test commands, and feature summary.
