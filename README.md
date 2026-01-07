# Employee Polls

Employee Polls is a React + Redux “Would You Rather” dashboard. Users sign in as any of the demo accounts, browse unanswered vs completed polls, vote, create new questions, and track standings on a leaderboard — all powered by the `_DATA.js` mock API.

## Quick Start
- Prerequisite: Node 18+ and npm.
- Install dependencies: `npm install`
- Start the dev server: `npm run dev` (Vite on http://localhost:5173)
- Run the test suite: `npm test`
- Lint the project: `npm run lint`
- Production build / preview: `npm run build` then `npm run preview`

## App Flow
- Login gate protects all routes and redirects back to the originally requested path after sign-in.
- Home dashboard shows Active (unanswered) and Completed (answered) polls sorted by recency.
- Poll detail handles voting, shows percentages, and highlights your choice; invalid ids render Not Found.
- New poll form validates both options and redirects back to the Active list after creation.
- Leaderboard ranks users by created + answered counts and highlights the current user.

## Demo Accounts (no password required)
- `sarahedo` — Sarah Edo
- `tylermcginnis` — Tyler McGinnis
- `mtsamis` — Mike Tsamis
- `zoshikanlu` — Zenobia Oshikanlu

## Tech Stack
- React 19 with React Router 7 for routing
- Redux Toolkit + React Redux for global state
- Vite for dev/build tooling
- Jest + React Testing Library for tests

## Mock API Reference
`src/api/_DATA.js` exposes:
- `_getUsers()` and `_getQuestions()` to load initial state
- `_saveQuestion({ author, optionOneText, optionTwoText })` to create polls
- `_saveQuestionAnswer({ authedUser, qid, answer })` to record votes

Users contain `id`, `name`, `avatarURL`, `questions`, and `answers`; questions contain `id`, `author`, `timestamp`, and two options (`optionOne`/`optionTwo`) with `text` and `votes`.
