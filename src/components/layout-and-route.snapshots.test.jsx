import { describe, expect, test } from '@jest/globals';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import ProtectedRoute from './ProtectedRoute';
import { createAppStore } from '../store';

const sampleQuestions = {
  q1: {
    id: 'q1',
    author: 'jane',
    timestamp: 1,
    optionOne: { text: 'A', votes: [] },
    optionTwo: { text: 'B', votes: [] },
  },
};

describe('Layout and ProtectedRoute snapshots', () => {
  test('Layout renders shell for authed user', () => {
    const store = createAppStore({
      auth: { authedUser: 'jane' },
      users: { jane: { id: 'jane', name: 'Jane Doe', avatarURL: '', answers: {}, questions: [] } },
      questions: sampleQuestions,
    });

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<div>Home content</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('ProtectedRoute renders login redirect for guests', () => {
    const store = createAppStore({
      auth: { authedUser: null },
      users: {},
      questions: {},
    });

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/private']}>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/private" element={<div>Secret content</div>} />
            </Route>
            <Route path="/login" element={<div>Login page</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
