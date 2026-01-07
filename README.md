# Employee Polls Project

Employee Polls is a React + Redux single-page app for running “Would You Rather” style polls. Users log in as any available account, browse unanswered vs completed polls, vote, create new questions, and track standings on a leaderboard — all backed by the `_DATA.js` mock API.

## Getting Started
- Install dependencies: `npm install`
- Start the dev server: `npm run dev`
- Run the test suite: `npm run test`

## Project Features
- Login gate for all routes with redirect back to the originally requested path
- Home dashboard split into Active (unanswered) and Completed (answered) polls, sorted by recency
- Poll detail view that handles voting, displays percentages, and highlights your choice
- New poll form with validation and redirect back to the Active list after creation
- Leaderboard ranking users by created + answered counts with a highlighted current user row
- Not Found view for invalid poll ids or routes

## Data Model Reference
Data comes from `src/api/_DATA.js`, which exposes:
- `_getUsers()` and `_getQuestions()` to load initial state
- `_saveQuestion({ author, optionOneText, optionTwoText })` to create polls
- `_saveQuestionAnswer({ authedUser, qid, answer })` to record votes

Users contain `id`, `name`, `avatarURL`, `questions`, and `answers`; questions contain `id`, `author`, `timestamp`, and two options (`optionOne`/`optionTwo`) with `text` and `votes`.
