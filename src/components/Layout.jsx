import { useEffect, useRef } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  bootstrapApp,
  logout,
  selectAuthedUser,
  selectQuestions,
  selectUi,
  selectUsers,
} from '../store';

const Layout = () => {
  const dispatch = useDispatch();
  const authedUser = useSelector(selectAuthedUser);
  const users = useSelector(selectUsers);
  const questions = useSelector(selectQuestions);
  const ui = useSelector(selectUi);
  const hasBootstrapped = useRef(false);

  useEffect(() => {
    if (hasBootstrapped.current) return;
    const hasData = Object.keys(users || {}).length > 0 || Object.keys(questions || {}).length > 0;
    if (!hasData) {
      hasBootstrapped.current = true;
      dispatch(bootstrapApp());
    }
  }, [dispatch, users, questions]);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">Employee Polls</div>
        <nav className="nav-links">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/leaderboard">Leaderboard</NavLink>
          <NavLink to="/add">New Poll</NavLink>
        </nav>
        <div className="user-actions">
          {authedUser ? (
            <>
              <span className="user-chip">{authedUser}</span>
              <button type="button" className="ghost-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login">Login</NavLink>
          )}
        </div>
      </header>

      <main className="app-content">
        {ui.loading && (
          <div className="app-banner" role="status">
            Loading data...
          </div>
        )}
        {ui.error && (
          <div className="app-banner error" role="alert">
            {ui.error}
          </div>
        )}
        <Outlet />
      </main>

      <footer className="app-footer">Would You Rather • Udacity Master Employee Polls</footer>
    </div>
  );
};

export default Layout;
