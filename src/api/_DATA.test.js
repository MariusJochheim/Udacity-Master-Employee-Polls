import { jest } from '@jest/globals';
import { _saveQuestion, _saveQuestionAnswer } from './_DATA.js';

afterEach(() => {
  jest.useRealTimers();
});

describe('_saveQuestion', () => {
  test('returns saved question with all expected fields for valid input', async () => {
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
  });

  test('rejects with an error for invalid input', async () => {
    await expect(_saveQuestion({ optionOneText: 'Only one option' })).rejects.toEqual(
      'Please provide optionOneText, optionTwoText, and author'
    );
  });
});

describe('_saveQuestionAnswer', () => {
  test('returns true for valid input', async () => {
    jest.useFakeTimers();

    const answerPayload = {
      authedUser: 'sarahedo',
      qid: '8xf0y6ziyjabvozdd253nd',
      answer: 'optionTwo',
    };

    const savePromise = _saveQuestionAnswer(answerPayload);

    jest.runAllTimers();

    await expect(savePromise).resolves.toBe(true);
  });

  test('rejects with an error for invalid input', async () => {
    await expect(
      _saveQuestionAnswer({
        authedUser: 'sarahedo',
        qid: '',
        answer: '',
      })
    ).rejects.toEqual('Please provide authedUser, qid, and answer');
  });
});
