import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import Card from '../components/Card';
import RadioCard from '../components/RadioCard';
import Spinner from '../components/Spinner';
import {
  saveAnswer,
  selectAuthedUser,
  selectQuestions,
  selectUi,
  selectUsers,
} from '../store';
import useDocumentTitle from '../hooks/useDocumentTitle';
import NotFound from './NotFound';

const QuestionDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const authedUser = useSelector(selectAuthedUser);
  const questions = useSelector(selectQuestions);
  const users = useSelector(selectUsers);
  const ui = useSelector(selectUi);
  const [selectedOption, setSelectedOption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [banner, setBanner] = useState(null);
  const question = questions?.[id];

  useDocumentTitle(question ? 'Would You Rather' : 'Not Found');

  const votesOne = question?.optionOne?.votes || [];
  const votesTwo = question?.optionTwo?.votes || [];

  const userChoice = useMemo(() => {
    if (!authedUser || !question) return null;
    if (votesOne.includes(authedUser)) return 'optionOne';
    if (votesTwo.includes(authedUser)) return 'optionTwo';
    return null;
  }, [authedUser, question, votesOne, votesTwo]);

  useEffect(() => {
    if (userChoice) {
      setSelectedOption(userChoice);
    }
  }, [userChoice]);

  if (!id) {
    return <NotFound />;
  }

  const hasQuestionsLoaded = Object.keys(questions || {}).length > 0;

  if (!question) {
    if (ui.loading && !hasQuestionsLoaded) {
      return (
        <section className="panel">
          <Spinner label="Loading poll..." />
        </section>
      );
    }

    return <NotFound />;
  }

  const author = users?.[question.author];
  const totalVotes = votesOne.length + votesTwo.length;
  const hasAnswered = Boolean(userChoice);
  const saving = ui.savingAnswer;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedOption || hasAnswered || saving || isSubmitting) return;

    setBanner(null);
    setIsSubmitting(true);

    try {
      await dispatch(saveAnswer({ authedUser, qid: id, answer: selectedOption }));
      setBanner({ type: 'success', message: 'Vote recorded! See updated results below.' });
    } catch (error) {
      setBanner({
        type: 'error',
        message: error?.message || 'Unable to submit your vote. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderResultCard = (optionKey, option, accentColor) => {
    const votes = option?.votes || [];
    const percentage = totalVotes > 0 ? Math.round((votes.length / totalVotes) * 100) : 0;
    const isUsersChoice = userChoice === optionKey;

    return (
      <Card
        key={optionKey}
        className={`vote-result ${isUsersChoice ? 'is-selected' : ''}`}
        accentColor={accentColor}
        title={
          <div className="vote-header">
            <span>{optionKey === 'optionOne' ? 'Option One' : 'Option Two'}</span>
            {isUsersChoice && <span className="vote-badge">Your vote</span>}
          </div>
        }
        subtitle={option?.text}
      >
        <div className="vote-meter" role="presentation" aria-hidden>
          <div className="vote-meter-fill" style={{ width: `${percentage}%` }} />
        </div>
        <p className="muted">
          {votes.length} out of {totalVotes} votes • {percentage}%
        </p>
      </Card>
    );
  };

  return (
    <section className="panel">
      <header className="poll-detail-header">
        <div className="poll-author">
          <Avatar src={author?.avatarURL} name={author?.name || question.author} />
          <div>
            <p className="muted">Poll by</p>
            <h1 className="poll-title">{author?.name || question.author}</h1>
          </div>
        </div>
        <div className="poll-meta">
          <span className="muted">Poll ID</span>
          <code>{question.id}</code>
        </div>
      </header>

      <h2>Would You Rather...</h2>

      {banner?.type === 'success' && (
        <div className="app-banner" role="status">
          {banner.message}
        </div>
      )}
      {banner?.type === 'error' && (
        <div className="app-banner error" role="alert">
          {banner.message}
        </div>
      )}

      {!hasAnswered ? (
        <form className="stack" onSubmit={handleSubmit}>
          <RadioCard
            name="poll-choice"
            value="optionOne"
            label="Option One"
            description={question.optionOne.text}
            checked={selectedOption === 'optionOne'}
            disabled={saving}
            onChange={(e) => {
              setSelectedOption(e.target.value);
              setBanner(null);
            }}
          />
          <RadioCard
            name="poll-choice"
            value="optionTwo"
            label="Option Two"
            description={question.optionTwo.text}
            checked={selectedOption === 'optionTwo'}
            disabled={saving}
            onChange={(e) => {
              setSelectedOption(e.target.value);
              setBanner(null);
            }}
          />
          <div className="vote-actions">
            <Button
              type="submit"
              variant="primary"
              disabled={!selectedOption || saving || isSubmitting}
            >
              {saving || isSubmitting ? 'Submitting...' : 'Submit Vote'}
            </Button>
          </div>
        </form>
      ) : (
        <div className="vote-results" data-testid="vote-results">
          {renderResultCard('optionOne', question.optionOne, 'var(--color-teal)')}
          {renderResultCard('optionTwo', question.optionTwo, 'var(--color-amber)')}
        </div>
      )}
    </section>
  );
};

export default QuestionDetail;
