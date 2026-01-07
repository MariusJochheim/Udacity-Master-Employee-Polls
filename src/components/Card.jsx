const Card = ({
  title,
  subtitle,
  accentColor,
  actions,
  footer,
  children,
  className = '',
  ...props
}) => {
  const classes = ['card', className].filter(Boolean).join(' ');
  const renderTitle = () => {
    if (!title) return null;
    if (typeof title === 'string') return <h3>{title}</h3>;
    return <div className="card-title">{title}</div>;
  };

  return (
    <article className={classes} {...props}>
      <div className="card-accent" style={{ background: accentColor || 'var(--color-teal)' }} />
      {(title || actions) && (
        <header className="card-header">
          <div>
            {renderTitle()}
            {subtitle && <p className="muted">{subtitle}</p>}
          </div>
          {actions && <div className="card-actions">{actions}</div>}
        </header>
      )}
      <div className="card-body">{children}</div>
      {footer && <footer className="card-footer">{footer}</footer>}
    </article>
  );
};

export default Card;
