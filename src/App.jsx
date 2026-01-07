import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import QuestionDetail from './pages/QuestionDetail';
import NewQuestion from './pages/NewQuestion';
import Leaderboard from './pages/Leaderboard';
import NotFound from './pages/NotFound';
import './App.css';

const App = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route index element={<Home />} />
        <Route path="/questions/:id" element={<QuestionDetail />} />
        <Route path="/add" element={<NewQuestion />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Route>
  </Routes>
);

export default App;
