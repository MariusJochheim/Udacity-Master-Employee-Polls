import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { login, selectUsers } from '../store';
import useDocumentTitle from '../hooks/useDocumentTitle';

const Login = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const [selectedUser, setSelectedUser] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const redirectTo = location.state?.redirectTo || '/';
  useDocumentTitle('Login');

  const userList = useMemo(() => Object.values(users || {}), [users]);

  useEffect(() => {
    if (!selectedUser && userList.length > 0) {
      setSelectedUser(userList[0].id);
    }
  }, [userList, selectedUser]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedUser) return;
    dispatch(login(selectedUser));
    navigate(redirectTo, { replace: true });
  };

  return (
    <section className="panel">
      <h1>Sign In</h1>
      <p className="muted">Select a user to continue.</p>
      {userList.length === 0 ? (
        <div className="app-banner error" role="alert">
          No users available. Please try again later.
        </div>
      ) : (
        <form className="stack" onSubmit={handleSubmit}>
          <label htmlFor="user-select">Choose a user</label>
          <select
            id="user-select"
            value={selectedUser}
            onChange={(event) => setSelectedUser(event.target.value)}
          >
            {userList.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          <button type="submit" disabled={!selectedUser}>
            Sign In
          </button>
        </form>
      )}
    </section>
  );
};

export default Login;
