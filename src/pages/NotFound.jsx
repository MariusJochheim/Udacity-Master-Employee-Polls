import useDocumentTitle from '../hooks/useDocumentTitle';

const NotFound = () => {
  useDocumentTitle('Not Found');

  return (
    <section className="panel">
      <h1>Not Found</h1>
      <p className="muted">The requested poll or page could not be located.</p>
    </section>
  );
};

export default NotFound;
