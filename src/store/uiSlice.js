import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  savingAnswer: false,
  savingQuestion: false,
  error: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setSavingAnswer(state, action) {
      state.savingAnswer = action.payload;
    },
    setSavingQuestion(state, action) {
      state.savingQuestion = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const { setLoading, setSavingAnswer, setSavingQuestion, setError, clearError } =
  uiSlice.actions;

export const selectUi = (state) => state.ui;

export default uiSlice.reducer;
