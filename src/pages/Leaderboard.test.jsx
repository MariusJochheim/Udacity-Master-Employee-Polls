import { beforeEach, describe, expect, test } from '@jest/globals';
import { Provider } from 'react-redux';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Leaderboard from './Leaderboard';
import { createAppStore } from '../store';

const sampleUsers = {
  alex: {
    id: 'alex',
    name: 'Alex Smith',
    avatarURL: '',
    answers: { q1: 'optionOne', q3: 'optionTwo' },
    questions: ['q2'],
  },
  sam: {
    id: 'sam',
    name: 'Sam Lee',
    avatarURL: '',
    answers: {},
    questions: ['q1'],
  },
  robin: {
    id: 'robin',
    name: 'Robin Jones',
    avatarURL: '',
    answers: { q2: 'optionOne' },
    questions: [],
  },
};

const sampleQuestions = {
  q1: {
    id: 'q1',
    author: 'sam',
    timestamp: 1700000000000,
    optionOne: { text: 'Option A', votes: [] },
    optionTwo: { text: 'Option B', votes: [] },
  },
  q2: {
    id: 'q2',
    author: 'alex',
    timestamp: 1700000001000,
    optionOne: { text: 'Option C', votes: [] },
    optionTwo: { text: 'Option D', votes: [] },
  },
  q3: {
    id: 'q3',
    author: 'alex',
    timestamp: 1699999999000,
    optionOne: { text: 'Option E', votes: [] },
    optionTwo: { text: 'Option F', votes: [] },
  },
};

const renderLeaderboard = () =>
  render(
    <Provider
      store={createAppStore({
        auth: { authedUser: 'alex' },
        users: sampleUsers,
        questions: sampleQuestions,
      })}
    >
      <MemoryRouter>
        <Leaderboard />
      </MemoryRouter>
    </Provider>
  );

describe('Leaderboard page', () => {
  beforeEach(() => {
    document.title = '';
  });

  test('ranks users by combined answered and created totals', () => {
    renderLeaderboard();

    const rows = screen.getAllByTestId('leaderboard-row');
    expect(rows).toHaveLength(3);

    const [first, second, third] = rows;
    expect(first).toHaveClass('is-current-user');
    expect(within(first).getByText(/alex smith/i)).toBeInTheDocument();
    expect(within(first).getByText('Score')).toBeInTheDocument();
    expect(within(first).getByText('3')).toBeInTheDocument();

    const answeredStat = within(first).getByText('Answered');
    expect(answeredStat.nextElementSibling).toHaveTextContent('2');
    const createdStat = within(first).getByText('Created');
    expect(createdStat.nextElementSibling).toHaveTextContent('1');

    expect(within(second).getByText(/robin jones/i)).toBeInTheDocument();
    expect(within(third).getByText(/sam lee/i)).toBeInTheDocument();
    expect(document.title).toBe('Leaderboard | Employee Polls');
  });
});
