import {
  _getQuestions,
  _getUsers,
  _saveQuestion,
  _saveQuestionAnswer,
} from '../api/_DATA';
import { clearAuthedUser, persistAuthedUser, setAuthedUser } from './authSlice';
import {
  clearError,
  setError,
  setLoading,
  setSavingAnswer,
  setSavingQuestion,
} from './uiSlice';
import { addAnswerToQuestion, addQuestion, setQuestions } from './questionsSlice';
import { addAnswerToUser, addQuestionToUser, setUsers } from './usersSlice';

const buildErrorMessage = (error) => {
  if (typeof error === 'string') {
    return error;
  }

  if (error?.message) {
    return error.message;
  }

  return 'Something went wrong';
};

export const bootstrapApp = () => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(clearError());

  try {
    const [users, questions] = await Promise.all([_getUsers(), _getQuestions()]);
    dispatch(setUsers(users));
    dispatch(setQuestions(questions));
    return { users, questions };
  } catch (error) {
    const message = buildErrorMessage(error);
    dispatch(setError(message));
    throw new Error(message);
  } finally {
    dispatch(setLoading(false));
  }
};

export const login = (userId) => (dispatch) => {
  dispatch(setAuthedUser(userId));
  persistAuthedUser(userId);
  dispatch(clearError());
};

export const logout = () => (dispatch) => {
  dispatch(clearAuthedUser());
  persistAuthedUser(null);
  dispatch(clearError());
};

export const saveAnswer =
  ({ authedUser, qid, answer }) =>
  async (dispatch) => {
    dispatch(setSavingAnswer(true));
    dispatch(clearError());

    try {
      await _saveQuestionAnswer({ authedUser, qid, answer });
      dispatch(addAnswerToUser({ authedUser, qid, answer }));
      dispatch(addAnswerToQuestion({ authedUser, qid, answer }));
    } catch (error) {
      const message = buildErrorMessage(error);
      dispatch(setError(message));
      throw new Error(message);
    } finally {
      dispatch(setSavingAnswer(false));
    }
  };

export const saveQuestion =
  ({ optionOneText, optionTwoText }) =>
  async (dispatch, getState) => {
    dispatch(setSavingQuestion(true));
    dispatch(clearError());

    const authedUser = getState().auth.authedUser;

    if (!authedUser) {
      const message = 'User must be logged in to create a question';
      dispatch(setError(message));
      dispatch(setSavingQuestion(false));
      throw new Error(message);
    }

    try {
      const question = await _saveQuestion({ optionOneText, optionTwoText, author: authedUser });
      dispatch(addQuestion(question));
      dispatch(addQuestionToUser({ author: authedUser, qid: question.id }));
      return question;
    } catch (error) {
      const message = buildErrorMessage(error);
      dispatch(setError(message));
      throw new Error(message);
    } finally {
      dispatch(setSavingQuestion(false));
    }
  };
