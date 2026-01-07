import { describe, expect, test, beforeEach } from '@jest/globals';
import { Provider } from 'react-redux';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';
import { addAnswerToQuestion, addAnswerToUser, createAppStore } from '../store';

const baseUsers = {
  sara: {
    id: 'sara',
    name: 'Sara Stone',
    avatarURL: '',
    answers: { q2: 'optionOne' },
    questions: [],
  },
  alex: {
    id: 'alex',
    name: 'Alex White',
    avatarURL: '',
    answers: {},
    questions: [],
  },
};

const baseQuestions = {
  q1: {
    id: 'q1',
    author: 'alex',
    timestamp: 1700000000000,
    optionOne: { text: 'Travel to the moon', votes: [] },
    optionTwo: { text: 'Dive in the Mariana trench', votes: [] },
  },
  q2: {
    id: 'q2',
    author: 'sara',
    timestamp: 1690000000000,
    optionOne: { text: 'Eat pizza forever', votes: ['sara'] },
    optionTwo: { text: 'Give up pizza', votes: [] },
  },
};

const renderHome = (store) =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    </Provider>
  );

describe('Home page', () => {
  beforeEach(() => {
    document.title = '';
  });

  test('shows active polls by default and greets the user', () => {
    const store = createAppStore({
      auth: { authedUser: 'sara' },
      users: baseUsers,
      questions: baseQuestions,
    });

    renderHome(store);

    expect(screen.getByRole('heading', { name: /sara stone/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /active/i })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText(/travel to the moon/i)).toBeInTheDocument();
    expect(screen.queryByText(/eat pizza forever/i)).not.toBeInTheDocument();
  });

  test('switches to completed tab and lists answered polls', () => {
    const store = createAppStore({
      auth: { authedUser: 'sara' },
      users: baseUsers,
      questions: baseQuestions,
    });

    renderHome(store);

    fireEvent.click(screen.getByRole('tab', { name: /completed/i }));
    expect(screen.getByRole('tab', { name: /completed/i })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(screen.getByText(/eat pizza forever/i)).toBeInTheDocument();
    expect(screen.queryByText(/travel to the moon/i)).not.toBeInTheDocument();
  });

  test('moves a poll from active to completed after answering', () => {
    const store = createAppStore({
      auth: { authedUser: 'sara' },
      users: {
        ...baseUsers,
        sara: { ...baseUsers.sara, answers: {} },
      },
      questions: {
        ...baseQuestions,
        q2: {
          ...baseQuestions.q2,
          optionOne: { ...baseQuestions.q2.optionOne, votes: [] },
        },
      },
    });

    renderHome(store);

    const activeList = screen.getByTestId('active-list');
    expect(within(activeList).getByText(/travel to the moon/i)).toBeInTheDocument();

    act(() => {
      store.dispatch(
        addAnswerToQuestion({ authedUser: 'sara', qid: 'q1', answer: 'optionOne' })
      );
      store.dispatch(addAnswerToUser({ authedUser: 'sara', qid: 'q1', answer: 'optionOne' }));
    });

    fireEvent.click(screen.getByRole('tab', { name: /completed/i }));
    const completedList = screen.getByTestId('completed-list');
    expect(within(completedList).getByText(/travel to the moon/i)).toBeInTheDocument();
    expect(within(completedList).getByText(/dive in the mariana trench/i)).toBeInTheDocument();
  });
});
