import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import {
  addAnswerToQuestion,
  addAnswerToUser,
  bootstrapApp,
  selectAuthedUser,
  selectQuestions,
  selectUi,
  selectUsers,
} from '../store';
import useDocumentTitle from '../hooks/useDocumentTitle';
import Tabs from '../components/Tabs';
import Card from '../components/Card';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';

const formatDate = (timestamp) =>
  new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
  }).format(timestamp);

const Home = () => {
  const dispatch = useDispatch();
  const authedUser = useSelector(selectAuthedUser);
  const users = useSelector(selectUsers);
  const questions = useSelector(selectQuestions);
  const ui = useSelector(selectUi);
  const location = useLocation();
  const initialTabFromState = location.state?.initialTab;
  const [activeTab, setActiveTab] = useState(initialTabFromState || 'active');
  const hasRequestedBootstrap = useRef(false);
  useDocumentTitle('Home');

  useEffect(() => {
    if (initialTabFromState) {
      setActiveTab(initialTabFromState);
    }
  }, [initialTabFromState]);

  useEffect(() => {
    const hasUsers = Object.keys(users || {}).length > 0;
    const hasQuestions = Object.keys(questions || {}).length > 0;
    if (!hasUsers || !hasQuestions) {
      if (hasRequestedBootstrap.current || ui.loading) return;
      hasRequestedBootstrap.current = true;
      dispatch(bootstrapApp());
    }
  }, [dispatch, users, questions, ui.loading]);

  const authedUserData = authedUser ? users?.[authedUser] : null;

  const { activePolls, completedPolls } = useMemo(() => {
    const values = Object.values(questions || {});
    const sorted = values.sort((a, b) => b.timestamp - a.timestamp);

    return sorted.reduce(
      (acc, question) => {
        const votesOne = question.optionOne?.votes || [];
        const votesTwo = question.optionTwo?.votes || [];
        const hasAnswered =
          authedUser && (votesOne.includes(authedUser) || votesTwo.includes(authedUser));

        if (hasAnswered) {
          acc.completedPolls.push(question);
        } else {
          acc.activePolls.push(question);
        }
        return acc;
      },
      { activePolls: [], completedPolls: [] }
    );
  }, [questions, authedUser]);

  const pollsToRender = activeTab === 'active' ? activePolls : completedPolls;

  const tabs = [
    { key: 'active', label: 'Active', badge: activePolls.length },
    { key: 'completed', label: 'Completed', badge: completedPolls.length },
  ];

  const handleSimulateAnswer = (questionId, answer) => {
    if (!authedUser) return;
    dispatch(addAnswerToQuestion({ authedUser, qid: questionId, answer }));
    dispatch(addAnswerToUser({ authedUser, qid: questionId, answer }));
  };

  return (
    <section className="panel">
      <header className="home-hero">
        <div>
          <p className="muted">Welcome back{authedUserData ? ',' : ''}</p>
          <h1>{authedUserData?.name || authedUser || 'Guest'}</h1>
          <p className="muted">Choose a poll to vote or review your completed answers.</p>
        </div>
      </header>

      <Tabs tabs={tabs} activeKey={activeTab} onChange={setActiveTab} />

      <div className="poll-grid" data-testid={`${activeTab}-list`}>
        {pollsToRender.length === 0 ? (
          <EmptyState
            title={`No ${activeTab === 'active' ? 'active' : 'completed'} polls`}
            description={
              activeTab === 'active'
                ? 'All caught up! Create a new poll or check completed ones.'
                : 'You have not answered any polls yet.'
            }
            action={
              activeTab === 'active' ? (
                <Button as={Link} to="/add" variant="secondary">
                  Create Poll
                </Button>
              ) : null
            }
          />
        ) : (
          pollsToRender.map((question) => {
            const author = users?.[question.author];
            const optionOne = question.optionOne?.text || '';
            const optionTwo = question.optionTwo?.text || '';
            const isCompleted = completedPolls.includes(question);

            return (
              <Card
                key={question.id}
                className="poll-card"
                accentColor={isCompleted ? 'var(--color-amber)' : undefined}
                title={
                  <div className="poll-author">
                    <Avatar src={author?.avatarURL} name={author?.name || question.author} />
                    <div>
                      <strong>{author?.name || question.author}</strong>
                      <p className="muted">Asked {formatDate(question.timestamp)}</p>
                    </div>
                  </div>
                }
                footer={
                  <div className="poll-actions">
                    <Button as={Link} to={`/questions/${question.id}`} variant="primary">
                      View Poll
                    </Button>
                    {!isCompleted && authedUser && (
                      <Button
                        variant="secondary"
                        onClick={() => handleSimulateAnswer(question.id, 'optionOne')}
                        aria-label={`Mark ${optionOne} answered`}
                      >
                        Quick mark answered
                      </Button>
                    )}
                  </div>
                }
              >
                <p className="muted">Would you rather...</p>
                <h3 className="poll-question">
                  {optionOne} <span className="muted">or</span> {optionTwo}?
                </h3>
              </Card>
            );
          })
        )}
      </div>

      {ui.loading && (
        <p className="muted" role="status">
          Fetching polls...
        </p>
      )}
    </section>
  );
};

export default Home;
