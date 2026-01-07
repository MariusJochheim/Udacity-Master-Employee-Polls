import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuthedUser } from '../store';

const ProtectedRoute = () => {
  const authedUser = useSelector(selectAuthedUser);
  const location = useLocation();

  if (!authedUser) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ redirectTo: `${location.pathname}${location.search}` }}
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
