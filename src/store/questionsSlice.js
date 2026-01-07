import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    setQuestions(state, action) {
      return action.payload || {};
    },
    addAnswerToQuestion(state, action) {
      const { authedUser, qid, answer } = action.payload;
      const question = state[qid];

      if (!question || !question[answer]) {
        return state;
      }

      const votes = question[answer].votes || [];
      if (!votes.includes(authedUser)) {
        question[answer].votes = votes.concat([authedUser]);
      }
    },
    addQuestion(state, action) {
      const question = action.payload;
      if (question?.id) {
        state[question.id] = question;
      }
    },
  },
});

export const { setQuestions, addAnswerToQuestion, addQuestion } = questionsSlice.actions;

export const selectQuestions = (state) => state.questions;

export default questionsSlice.reducer;
