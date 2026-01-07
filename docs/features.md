# Employee Polls Feature Specification

## Overview
- React single-page app for "Would You Rather" polls backed by the provided `_DATA.js` mock API.
- Users impersonate any listed account to log in; no passwords are required beyond the selected user.
- Core pages: Login, Home (Active/Completed), Poll Detail, New Poll, Leaderboard, and a Not Found fallback.

## Functional Requirements

### Authentication
- Login screen lists all users with avatar and name; selecting one sets `authedUser`.
- Persist `authedUser` in local storage to keep the session on refresh; logout clears it and redirects to Login.
- Protected routes redirect unauthenticated visitors to Login while preserving the requested path for post-login return; any typed URL requires login first.
- Invalid poll IDs prompt login first (if not authenticated) and then show the Not Found page.
- Only authenticated users can vote, create polls, or view the leaderboard; after login the Home page is shown.

### Home Dashboard
- Root route `/` shows the dashboard with two tabs: `Active` (questions the `authedUser` has not answered) and `Completed` (questions answered by the user).
- Sort both lists by `timestamp` descending.
- Poll preview card shows author avatar/name, creation time, and truncated option text. Primary call-to-action: `View Poll`.
- Empty states for either tab display a friendly message and a link to `Create Poll`.
- Default view shows `Active` (unanswered) tab selected.
- Logged-in user name is visible on the page near navigation/user capsule.
- Each poll is placed in the correct tab based on whether `authedUser.answers` contains its id; after voting, it moves to `Completed`.

### Poll Detail
- Accessible at `/questions/:id`; layout shows the author (name + avatar), the prompt "Would you rather...", and the two options.
- Unanswered poll: radio/selectable cards for both options plus a `Submit Vote` button. Submission uses `_saveQuestionAnswer`.
- Validation: prevent submission until an option is chosen; disable further votes after success; surface errors from the mock API.
- Answered poll: display vote counts and percentages for each option, with the user's choice highlighted and labeled "Your vote".
- Show total votes; if `qid` is invalid, render the Not Found page.
- If a poll does not exist, the user is prompted to log in first (if not already) and then shown a 404; note that new polls cannot be revisited by URL due to backend constraints.
- After voting, the poll shows the answered state with updated counts and "Your vote" marker and is reflected in Leaderboard stats.

### New Poll
- Available at `/add`. Form displays heading text “Would You Rather” with two text inputs for `Option One` and `Option Two`; both required and trimmed. Character limit: 120 chars.
- Submit button stays disabled until both options are non-empty and distinct.
- On submit, call `_saveQuestion`; add the new question to the store, include it in the creator's `questions` list, and redirect to Home->Active.
- New polls appear in the correct category: for the author they start in `Active` until answered.

### Leaderboard
- Available at `/leaderboard`. Rank users by `score = answeredCount + createdCount` (descending). Tie-breaker: most recent activity time.
- Each row shows: rank number, avatar, name, created count, answered count, and total score badge.
- Highlight the logged-in user row for quick scanning.

### Navigation & Layout
- Persistent header visible on all pages (including Login and Not Found) with app name/logo, links to Home, New Poll, Leaderboard, and a user capsule (avatar, name, Logout).
- Responsive design supports mobile-first layout; navigation collapses into a menu on narrow screens.
- Not Found view with a clear message and link back to Home.

### Data & State
- Initial load requests `_getUsers()` and `_getQuestions()`, normalizes them into `users` and `questions` slices plus `authedUser`; initial UI must reflect backend data.
- Voting updates both `questions[qid].option*.votes` and `users[authedUser].answers[qid]`; creation updates `questions` and the creator's `questions` list; all saves persist back to the backend helpers.
- Show a loading indicator while bootstrapping data; show inline error banners for failed saves with retry guidance.
- All API interactions go through a Redux data layer; components do not call `_DATA` directly.
- The Redux store is the single source of truth for users/questions/auth; components derive state from selectors and dispatch actions to mutate.
- Components avoid duplicating store state; only form control state is kept locally when necessary.

### Accessibility & Quality
- All inputs and buttons are keyboard-accessible; focus states are visible; labels are associated with controls.
- Use semantic HTML for lists, forms, and navigation; set document titles per route.
- Handle slow network to the mock API with spinners and disabled buttons during pending state.

## Non-Functional Requirements
- Routing handled client-side; deep links to polls or leaderboard must work when refreshed.
- Code organized into reusable components (cards, buttons, tabs, avatars) and page containers.
- Linting via `npm run lint`; project must build with `npm run build` and pass basic smoke tests for main flows.
- No runtime errors or lint warnings from best practices (e.g., missing list keys); code remains formatted and warning-free.
