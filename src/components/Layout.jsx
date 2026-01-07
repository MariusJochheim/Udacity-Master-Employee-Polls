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
import Avatar from './Avatar';
import Button from './Button';
import Spinner from './Spinner';

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

  const authedUserData = authedUser ? users?.[authedUser] : null;

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-inner">
          <div className="brand">
            <span className="brand-mark" aria-hidden>
              EP
            </span>
            <div>
              <div>Employee Polls</div>
              <div className="muted" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Would You Rather
              </div>
            </div>
          </div>
          <nav className="nav-links" aria-label="Primary navigation">
            <NavLink to="/" end>
              Home
            </NavLink>
            <NavLink to="/leaderboard">Leaderboard</NavLink>
            <NavLink to="/add">New Poll</NavLink>
          </nav>
          <div className="user-actions">
            {authedUser ? (
              <>
                <span className="user-chip">
                  <Avatar
                    size="sm"
                    name={authedUserData?.name || authedUser}
                    src={authedUserData?.avatarURL}
                  />
                  <span>{authedUserData?.name || authedUser}</span>
                </span>
                <Button variant="ghost" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <NavLink to="/login" className="ui-button ui-button-secondary">
                Login
              </NavLink>
            )}
          </div>
        </div>
      </header>

      <main className="app-content">
        {ui.loading && (
          <div className="app-banner" role="status">
            <Spinner label="Loading data..." />
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
