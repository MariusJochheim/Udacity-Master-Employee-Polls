const EmptyState = ({ title, description, action, className = '' }) => {
  const classes = ['empty-state', className].filter(Boolean).join(' ');

  return (
    <div className={classes} role="status">
      <div className="empty-illustration" aria-hidden>
        ✦
      </div>
      {title && <h3>{title}</h3>}
      {description && <p className="muted">{description}</p>}
      {action && <div className="empty-action">{action}</div>}
    </div>
  );
};

export default EmptyState;
