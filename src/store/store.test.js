import { beforeAll, beforeEach, describe, expect, jest, test } from '@jest/globals';

const mockGetUsers = jest.fn();
const mockGetQuestions = jest.fn();
const mockSaveQuestion = jest.fn();
const mockSaveQuestionAnswer = jest.fn();

jest.unstable_mockModule('../api/_DATA', () => ({
  _getUsers: mockGetUsers,
  _getQuestions: mockGetQuestions,
  _saveQuestion: mockSaveQuestion,
  _saveQuestionAnswer: mockSaveQuestionAnswer,
}));

let createAppStore;
let bootstrapApp;
let saveAnswer;
let saveQuestion;
let login;
let logout;

const createMockStorage = () => {
  let store = {};
  return {
    getItem: (key) => (key in store ? store[key] : null),
    setItem: (key, value) => {
      store[key] = value;
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
};

beforeAll(async () => {
  ({ createAppStore } = await import('./index'));
  ({ bootstrapApp, saveAnswer, saveQuestion, login, logout } = await import('./thunks'));
});

beforeEach(() => {
  mockGetUsers.mockReset();
  mockGetQuestions.mockReset();
  mockSaveQuestion.mockReset();
  mockSaveQuestionAnswer.mockReset();
  Object.defineProperty(global, 'localStorage', {
    value: createMockStorage(),
    writable: true,
  });
  localStorage.clear();
});

const buildSampleData = () => ({
  users: {
    jane: {
      id: 'jane',
      name: 'Jane Doe',
      answers: {},
      questions: [],
    },
    john: {
      id: 'john',
      name: 'John Doe',
      answers: {},
      questions: [],
    },
  },
  questions: {
    q1: {
      id: 'q1',
      author: 'john',
      timestamp: 1,
      optionOne: { text: 'One', votes: [] },
      optionTwo: { text: 'Two', votes: [] },
    },
  },
});

describe('store state management', () => {
  test('loads authedUser from storage on init', () => {
    localStorage.setItem('authedUser', 'jane');
    const store = createAppStore();
    expect(store.getState().auth.authedUser).toBe('jane');
  });

  test('bootstrapApp hydrates users and questions and toggles loading', async () => {
    const sample = buildSampleData();
    mockGetUsers.mockResolvedValue(sample.users);
    mockGetQuestions.mockResolvedValue(sample.questions);

    const store = createAppStore();
    const bootstrapPromise = store.dispatch(bootstrapApp());

    expect(store.getState().ui.loading).toBe(true);

    await bootstrapPromise;

    expect(store.getState().ui.loading).toBe(false);
    expect(store.getState().users).toEqual(sample.users);
    expect(store.getState().questions).toEqual(sample.questions);
    expect(mockGetUsers).toHaveBeenCalledTimes(1);
    expect(mockGetQuestions).toHaveBeenCalledTimes(1);
  });

  test('saveAnswer updates both users and questions slices', async () => {
    const sample = buildSampleData();
    mockSaveQuestionAnswer.mockResolvedValue(true);
    const store = createAppStore({
      auth: { authedUser: 'jane' },
      users: sample.users,
      questions: sample.questions,
    });

    const savePromise = store.dispatch(
      saveAnswer({ authedUser: 'jane', qid: 'q1', answer: 'optionOne' })
    );

    expect(store.getState().ui.savingAnswer).toBe(true);
    await savePromise;

    const state = store.getState();
    expect(state.ui.savingAnswer).toBe(false);
    expect(state.users.jane.answers.q1).toBe('optionOne');
    expect(state.questions.q1.optionOne.votes).toContain('jane');
    expect(mockSaveQuestionAnswer).toHaveBeenCalledWith({
      authedUser: 'jane',
      qid: 'q1',
      answer: 'optionOne',
    });
  });

  test('saveQuestion uses authedUser, updates lists, and toggles saving flag', async () => {
    const sample = buildSampleData();
    const newQuestion = {
      id: 'new-question',
      author: 'jane',
      timestamp: 123,
      optionOne: { text: 'A', votes: [] },
      optionTwo: { text: 'B', votes: [] },
    };

    mockSaveQuestion.mockResolvedValue(newQuestion);

    const store = createAppStore({
      auth: { authedUser: 'jane' },
      users: sample.users,
      questions: sample.questions,
    });

    const savePromise = store.dispatch(
      saveQuestion({ optionOneText: 'A', optionTwoText: 'B' })
    );

    expect(store.getState().ui.savingQuestion).toBe(true);

    await savePromise;

    const state = store.getState();
    expect(state.ui.savingQuestion).toBe(false);
    expect(state.questions[newQuestion.id]).toEqual(newQuestion);
    expect(state.users.jane.questions).toContain(newQuestion.id);
    expect(mockSaveQuestion).toHaveBeenCalledWith({
      optionOneText: 'A',
      optionTwoText: 'B',
      author: 'jane',
    });
  });

  test('bootstrapApp surfaces errors and clears loading flag', async () => {
    mockGetUsers.mockRejectedValue(new Error('Network down'));
    const store = createAppStore();

    await expect(store.dispatch(bootstrapApp())).rejects.toThrow('Network down');

    expect(store.getState().ui.loading).toBe(false);
    expect(store.getState().ui.error).toBe('Network down');
  });

  test('logout clears authedUser state and storage', () => {
    localStorage.setItem('authedUser', 'john');
    const store = createAppStore({ auth: { authedUser: 'john' } });

    store.dispatch(login('john'));
    store.dispatch(logout());

    expect(store.getState().auth.authedUser).toBeNull();
    expect(localStorage.getItem('authedUser')).toBeNull();
  });
});
