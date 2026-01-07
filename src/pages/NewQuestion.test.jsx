import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { Provider } from 'react-redux';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import * as api from '../api/_DATA';
import Home from './Home';
import NewQuestion from './NewQuestion';
import { createAppStore } from '../store';

const sampleUsers = {
  alex: { id: 'alex', name: 'Alex Doe', avatarURL: '', answers: {}, questions: [] },
  jamie: { id: 'jamie', name: 'Jamie Fox', avatarURL: '', answers: {}, questions: [] },
};

const sampleQuestions = {
  q1: {
    id: 'q1',
    author: 'jamie',
    timestamp: 1700000000000,
    optionOne: { text: 'Visit Rome', votes: [] },
    optionTwo: { text: 'Visit Paris', votes: [] },
  },
};

describe('NewQuestion page', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    document.title = '';
  });

  test('requires both distinct options before enabling submit', () => {
    const store = createAppStore({
      auth: { authedUser: 'alex' },
      users: sampleUsers,
      questions: sampleQuestions,
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/add']}>
          <Routes>
            <Route path="/add" element={<NewQuestion />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    const submitButton = screen.getByRole('button', { name: /create poll/i });
    expect(submitButton).toBeDisabled();

    fireEvent.change(screen.getByLabelText(/option one/i), {
      target: { value: 'Learn guitar' },
    });
    expect(screen.getByRole('button', { name: /create poll/i })).toBeDisabled();

    fireEvent.change(screen.getByLabelText(/option two/i), {
      target: { value: 'Learn guitar' },
    });
    fireEvent.click(submitButton);

    expect(screen.getAllByText(/options must be different/i)).toHaveLength(2);

    fireEvent.change(screen.getByLabelText(/option two/i), {
      target: { value: 'Travel to Japan' },
    });
    expect(screen.getByRole('button', { name: /create poll/i })).not.toBeDisabled();
  });

  test('creates a poll, redirects home, and lists it under active', async () => {
    const store = createAppStore({
      auth: { authedUser: 'alex' },
      users: sampleUsers,
      questions: sampleQuestions,
    });

    const mockSave = jest.spyOn(api, '_saveQuestion').mockResolvedValue({
      id: 'new-question',
      author: 'alex',
      timestamp: 1700000001000,
      optionOne: { text: 'Build a robot', votes: [] },
      optionTwo: { text: 'Write a novel', votes: [] },
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/add']}>
          <Routes>
            <Route path="/add" element={<NewQuestion />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByLabelText(/option one/i), {
      target: { value: 'Build a robot' },
    });
    fireEvent.change(screen.getByLabelText(/option two/i), {
      target: { value: 'Write a novel' },
    });
    fireEvent.click(screen.getByRole('button', { name: /create poll/i }));

    await waitFor(() => expect(mockSave).toHaveBeenCalledTimes(1));
    expect(mockSave).toHaveBeenCalledWith({
      optionOneText: 'Build a robot',
      optionTwoText: 'Write a novel',
      author: 'alex',
    });

    const activeList = await screen.findByTestId('active-list');
    expect(within(activeList).getByText(/build a robot/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: /completed/i }));
    const completedList = await screen.findByTestId('completed-list');
    expect(within(completedList).queryByText(/build a robot/i)).not.toBeInTheDocument();
  });
});
