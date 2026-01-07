import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers(state, action) {
      return action.payload || {};
    },
    addAnswerToUser(state, action) {
      const { authedUser, qid, answer } = action.payload;
      const user = state[authedUser];

      if (!user) {
        return state;
      }

      if (!user.answers) {
        user.answers = {};
      }

      user.answers[qid] = answer;
    },
    addQuestionToUser(state, action) {
      const { author, qid } = action.payload;
      const user = state[author];

      if (!user) {
        return state;
      }

      if (!user.questions) {
        user.questions = [];
      }

      user.questions.push(qid);
    },
  },
});

export const { setUsers, addAnswerToUser, addQuestionToUser } = usersSlice.actions;

export const selectUsers = (state) => state.users;

export default usersSlice.reducer;
