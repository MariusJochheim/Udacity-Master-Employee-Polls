import useDocumentTitle from '../hooks/useDocumentTitle';

const Leaderboard = () => {
  useDocumentTitle('Leaderboard');

  return (
    <section className="panel">
      <h1>Leaderboard</h1>
      <p className="muted">Leaderboard details will appear here.</p>
    </section>
  );
};

export default Leaderboard;
