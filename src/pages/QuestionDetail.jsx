import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectQuestions, selectUsers } from '../store';
import useDocumentTitle from '../hooks/useDocumentTitle';
import NotFound from './NotFound';

const QuestionDetail = () => {
  const { id } = useParams();
  const questions = useSelector(selectQuestions);
  const users = useSelector(selectUsers);
  const question = questions?.[id];

  useDocumentTitle(question ? 'Would You Rather' : 'Not Found');

  if (!question) {
    return <NotFound />;
  }

  const author = users?.[question.author];

  return (
    <section className="panel">
      <p className="muted">Poll by {author?.name || question.author}</p>
      <h1>Would You Rather...</h1>
      <div className="stack">
        <div className="card">
          <strong>Option One</strong>
          <p>{question.optionOne.text}</p>
        </div>
        <div className="card">
          <strong>Option Two</strong>
          <p>{question.optionTwo.text}</p>
        </div>
      </div>
    </section>
  );
};

export default QuestionDetail;
