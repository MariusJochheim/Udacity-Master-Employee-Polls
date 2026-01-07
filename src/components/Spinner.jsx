const Spinner = ({ label = 'Loading...', className = '' }) => {
  const classes = ['spinner', className].filter(Boolean).join(' ');
  return (
    <div className={classes} role="status" aria-live="polite" aria-label={label}>
      <span className="spinner-circle" aria-hidden />
      {label && <span className="spinner-label">{label}</span>}
    </div>
  );
};

export default Spinner;
