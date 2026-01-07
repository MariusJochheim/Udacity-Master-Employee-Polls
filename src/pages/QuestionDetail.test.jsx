import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { Provider } from 'react-redux';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import * as api from '../api/_DATA';
import { createAppStore } from '../store';
import QuestionDetail from './QuestionDetail';

const renderQuestionDetail = (store, initialEntry = '/questions/q1') =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/questions/:id" element={<QuestionDetail />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );

describe('QuestionDetail page', () => {
  beforeEach(() => {
    document.title = '';
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('shows results for answered poll and highlights your vote', () => {
    const store = createAppStore({
      auth: { authedUser: 'alex' },
      users: {
        alex: { id: 'alex', name: 'Alex White', avatarURL: '', answers: { q1: 'optionTwo' } },
      },
      questions: {
        q1: {
          id: 'q1',
          author: 'alex',
          timestamp: Date.now(),
          optionOne: { text: 'Go hiking', votes: [] },
          optionTwo: { text: 'Stay home', votes: ['alex'] },
        },
      },
    });

    renderQuestionDetail(store);

    expect(screen.getByTestId('vote-results')).toBeInTheDocument();
    expect(screen.getByText(/your vote/i)).toBeInTheDocument();
    expect(screen.getByText(/stay home/i)).toBeInTheDocument();
    expect(screen.getByText(/1 out of 1 votes/i)).toBeInTheDocument();
  });

  test('submits a vote and prevents double submission', async () => {
    const saveSpy = jest.spyOn(api, '_saveQuestionAnswer').mockResolvedValue(true);
    const store = createAppStore({
      auth: { authedUser: 'alex' },
      users: {
        alex: { id: 'alex', name: 'Alex White', avatarURL: '', answers: {} },
      },
      questions: {
        q1: {
          id: 'q1',
          author: 'alex',
          timestamp: Date.now(),
          optionOne: { text: 'Tea', votes: [] },
          optionTwo: { text: 'Coffee', votes: [] },
        },
      },
    });

    renderQuestionDetail(store);

    fireEvent.click(screen.getByRole('radio', { name: /option one/i }));
    const submit = screen.getByRole('button', { name: /submit vote/i });

    fireEvent.click(submit);
    fireEvent.click(submit);

    expect(saveSpy).toHaveBeenCalledTimes(1);

    await waitFor(() => expect(screen.getByTestId('vote-results')).toBeInTheDocument());
    expect(screen.getByText(/your vote/i)).toBeInTheDocument();
    expect(screen.getByText(/1 out of 1 votes/i)).toBeInTheDocument();
  });
});
