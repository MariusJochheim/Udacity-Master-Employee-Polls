import { jest } from '@jest/globals';

const loadDataModule = async () => {
  jest.resetModules();
  return import('./_DATA.js');
};

afterEach(() => {
  jest.useRealTimers();
});

describe('_saveQuestion', () => {
  test('returns saved question with all expected fields for valid input', async () => {
    const { _saveQuestion, _getQuestions } = await loadDataModule();
    jest.useFakeTimers();

    const newQuestion = {
      optionOneText: 'Write tests for the data helpers',
      optionTwoText: 'Skip testing entirely',
      author: 'sarahedo',
    };

    const savePromise = _saveQuestion(newQuestion);
    jest.runAllTimers();
    const result = await savePromise;

    expect(result).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        timestamp: expect.any(Number),
        author: newQuestion.author,
        optionOne: { text: newQuestion.optionOneText, votes: [] },
        optionTwo: { text: newQuestion.optionTwoText, votes: [] },
      })
    );

    jest.useFakeTimers();
    const questionsPromise = _getQuestions();
    jest.runAllTimers();
    const questions = await questionsPromise;
    expect(questions[result.id]).toEqual(
      expect.objectContaining({
        optionOne: { text: newQuestion.optionOneText, votes: [] },
        optionTwo: { text: newQuestion.optionTwoText, votes: [] },
        author: newQuestion.author,
      })
    );
  });

  test('rejects with an error for invalid input', async () => {
    const { _saveQuestion } = await loadDataModule();
    await expect(_saveQuestion({ optionOneText: 'Only one option' })).rejects.toEqual(
      'Please provide optionOneText, optionTwoText, and author'
    );
  });
});

describe('_saveQuestionAnswer', () => {
  test('returns true for valid input', async () => {
    const { _saveQuestionAnswer, _getUsers, _getQuestions } = await loadDataModule();
    jest.useFakeTimers();

    const answerPayload = {
      authedUser: 'zoshikanlu',
      qid: 'vthrdm985a262al8qx3do',
      answer: 'optionTwo',
    };

    const savePromise = _saveQuestionAnswer(answerPayload);
    jest.runAllTimers();
    await expect(savePromise).resolves.toBe(true);

    jest.useFakeTimers();
    const usersPromise = _getUsers();
    jest.runAllTimers();
    const users = await usersPromise;

    jest.useFakeTimers();
    const questionsPromise = _getQuestions();
    jest.runAllTimers();
    const questions = await questionsPromise;

    expect(users[answerPayload.authedUser].answers[answerPayload.qid]).toBe(answerPayload.answer);
    expect(questions[answerPayload.qid][answerPayload.answer].votes).toContain(
      answerPayload.authedUser
    );
  });

  test('rejects with an error for invalid input', async () => {
    const { _saveQuestionAnswer } = await loadDataModule();
    await expect(
      _saveQuestionAnswer({
        authedUser: 'sarahedo',
        qid: '',
        answer: '',
      })
    ).rejects.toEqual('Please provide authedUser, qid, and answer');
  });
});

describe('_getUsers and _getQuestions', () => {
  test('_getUsers resolves a copy of users data', async () => {
    const { _getUsers } = await loadDataModule();
    jest.useFakeTimers();
    const usersPromise = _getUsers();
    jest.runAllTimers();
    const users = await usersPromise;

    users.fakeProperty = true;

    jest.useFakeTimers();
    const nextUsersPromise = _getUsers();
    jest.runAllTimers();
    const nextUsers = await nextUsersPromise;

    expect(nextUsers.fakeProperty).toBeUndefined();
    expect(Object.keys(nextUsers).length).toBeGreaterThan(0);
  });

  test('_getQuestions resolves a copy of questions data', async () => {
    const { _getQuestions } = await loadDataModule();
    jest.useFakeTimers();
    const questionsPromise = _getQuestions();
    jest.runAllTimers();
    const questions = await questionsPromise;

    questions.fakeProperty = true;

    jest.useFakeTimers();
    const nextQuestionsPromise = _getQuestions();
    jest.runAllTimers();
    const nextQuestions = await nextQuestionsPromise;

    expect(nextQuestions.fakeProperty).toBeUndefined();
    expect(Object.keys(nextQuestions).length).toBeGreaterThan(0);
  });
});
