import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import Avatar from '../components/Avatar';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import ScoreBadge from '../components/ScoreBadge';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { selectAuthedUser, selectQuestions, selectUsers } from '../store';

const Leaderboard = () => {
  useDocumentTitle('Leaderboard');
  const authedUser = useSelector(selectAuthedUser);
  const users = useSelector(selectUsers);
  const questions = useSelector(selectQuestions);

  const leaderboard = useMemo(() => {
    const questionMap = questions || {};
    const userList = Object.values(users || {});

    return userList
      .map((user) => {
        const answeredIds = Object.keys(user.answers || {});
        const createdIds = user.questions || [];
        const answeredCount = answeredIds.length;
        const createdCount = createdIds.length;
        const score = answeredCount + createdCount;
        const lastActivity = Math.max(
          0,
          ...createdIds.map((qid) => questionMap[qid]?.timestamp || 0),
          ...answeredIds.map((qid) => questionMap[qid]?.timestamp || 0)
        );

        return {
          ...user,
          answeredCount,
          createdCount,
          score,
          lastActivity,
        };
      })
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (b.lastActivity !== a.lastActivity) return b.lastActivity - a.lastActivity;
        return (a.name || a.id || '').localeCompare(b.name || b.id || '');
      });
  }, [users, questions]);

  return (
    <section className="panel">
      <div className="leaderboard-header">
        <div>
          <p className="muted">Answered + created polls determine rank.</p>
          <h1>Leaderboard</h1>
        </div>
        <div className="leaderboard-rule muted">Score = answered + created</div>
      </div>

      {leaderboard.length === 0 ? (
        <EmptyState
          title="No leaderboard data"
          description="Once polls are created and answered, rankings will appear here."
        />
      ) : (
        <div className="leaderboard-list" data-testid="leaderboard-list">
          {leaderboard.map((user, index) => {
            const isCurrent = user.id === authedUser;

            return (
              <Card
                key={user.id}
                className={`leaderboard-row ${isCurrent ? 'is-current-user' : ''}`}
                accentColor={index === 0 ? 'var(--color-amber)' : 'var(--color-teal)'}
                data-testid="leaderboard-row"
              >
                <div className="leaderboard-row-header">
                  <div className="leaderboard-rank" aria-label={`Rank ${index + 1}`}>
                    #{index + 1}
                  </div>
                  <div className="leaderboard-user">
                    <Avatar size="lg" name={user.name || user.id} src={user.avatarURL} />
                    <div>
                      <h3 className="leaderboard-name">{user.name || user.id}</h3>
                      <p className="muted">@{user.id}</p>
                    </div>
                    {isCurrent && <span className="leaderboard-you">You</span>}
                  </div>
                  <ScoreBadge score={user.score} />
                </div>

                <dl
                  className="leaderboard-stats"
                  aria-label={`${user.name || user.id} stats`}
                >
                  <div className="leaderboard-stat">
                    <dt>Answered</dt>
                    <dd>{user.answeredCount}</dd>
                  </div>
                  <div className="leaderboard-stat">
                    <dt>Created</dt>
                    <dd>{user.createdCount}</dd>
                  </div>
                </dl>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default Leaderboard;
