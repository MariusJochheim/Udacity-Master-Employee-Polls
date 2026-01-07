const RadioCard = ({
  name,
  value,
  label,
  description,
  checked = false,
  disabled = false,
  className = '',
  onChange,
  ...props
}) => {
  const classes = [
    'radio-card',
    checked ? 'is-checked' : '',
    disabled ? 'is-disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <label className={classes}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        {...props}
      />
      <span className="radio-mark" aria-hidden />
      <div className="radio-card-content">
        <p className="radio-card-title">{label}</p>
        {description && <p className="radio-card-description">{description}</p>}
      </div>
    </label>
  );
};

export default RadioCard;
