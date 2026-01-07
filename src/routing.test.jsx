import { describe, expect, test, beforeEach } from '@jest/globals';
import { Provider } from 'react-redux';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import App from './App';
import ProtectedRoute from './components/ProtectedRoute';
import { createAppStore } from './store';

const sampleUsers = {
  jane: { id: 'jane', name: 'Jane Doe', answers: {}, questions: [] },
  john: { id: 'john', name: 'John Doe', answers: {}, questions: [] },
};

const sampleQuestions = {
  q1: {
    id: 'q1',
    author: 'john',
    timestamp: Date.now(),
    optionOne: { text: 'Option A', votes: [] },
    optionTwo: { text: 'Option B', votes: [] },
  },
};

const LocationViewer = () => {
  const location = useLocation();
  return <pre data-testid="location-state">{JSON.stringify(location)}</pre>;
};

beforeEach(() => {
  document.title = '';
});

describe('routing and protection', () => {
  test('redirects unauthenticated users to login with redirectTo state', () => {
    render(
      <Provider
        store={createAppStore({
          auth: { authedUser: null },
          users: sampleUsers,
          questions: sampleQuestions,
        })}
      >
        <MemoryRouter initialEntries={['/leaderboard']}>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/leaderboard" element={<div>Private Leaderboard</div>} />
            </Route>
            <Route path="*" element={<LocationViewer />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    const location = JSON.parse(screen.getByTestId('location-state').textContent);
    expect(location.pathname).toBe('/login');
    expect(location.state).toEqual({ redirectTo: '/leaderboard' });
  });

  test('applies document titles for key routes', () => {
    render(
      <Provider
        store={createAppStore({
          auth: { authedUser: 'jane' },
          users: sampleUsers,
          questions: sampleQuestions,
        })}
      >
        <MemoryRouter initialEntries={['/leaderboard']}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(document.title).toBe('Leaderboard | Employee Polls');
  });

  test('invalid poll id redirects to login then returns Not Found after login', () => {
    render(
      <Provider
        store={createAppStore({
          auth: { authedUser: null },
          users: sampleUsers,
          questions: sampleQuestions,
        })}
      >
        <MemoryRouter initialEntries={['/questions/bad-id']}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    const select = screen.getByLabelText(/choose a user/i);
    fireEvent.change(select, { target: { value: 'jane' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByText(/not found/i)).toBeInTheDocument();
    expect(document.title).toBe('Not Found | Employee Polls');
  });
});
