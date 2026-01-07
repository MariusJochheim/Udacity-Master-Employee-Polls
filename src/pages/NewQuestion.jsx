import useDocumentTitle from '../hooks/useDocumentTitle';

const NewQuestion = () => {
  useDocumentTitle('New Poll');

  return (
    <section className="panel">
      <h1>Create a New Poll</h1>
      <p className="muted">Poll creation coming soon.</p>
    </section>
  );
};

export default NewQuestion;
