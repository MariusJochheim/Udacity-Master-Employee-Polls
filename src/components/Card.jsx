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

  return (
    <article className={classes} {...props}>
      <div className="card-accent" style={{ background: accentColor || 'var(--color-teal)' }} />
      {(title || actions) && (
        <header className="card-header">
          <div>
            {title && <h3>{title}</h3>}
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
