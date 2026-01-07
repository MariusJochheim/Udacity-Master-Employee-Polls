import { useSelector } from 'react-redux';
import { selectAuthedUser } from '../store';
import useDocumentTitle from '../hooks/useDocumentTitle';

const Home = () => {
  const authedUser = useSelector(selectAuthedUser);
  useDocumentTitle('Home');

  return (
    <section className="panel">
      <h1>Home</h1>
      <p>Welcome {authedUser || 'Guest'}! Choose a poll to get started.</p>
    </section>
  );
};

export default Home;
