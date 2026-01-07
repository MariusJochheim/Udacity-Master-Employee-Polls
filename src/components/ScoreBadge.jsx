const ScoreBadge = ({ score, label = 'Score', icon, className = '' }) => {
  const classes = ['score-badge', className].filter(Boolean).join(' ');
  return (
    <span className={classes}>
      {icon && <span className="button-icon">{icon}</span>}
      <span className="score-label">{label}</span>
      <span>{score}</span>
    </span>
  );
};

export default ScoreBadge;
