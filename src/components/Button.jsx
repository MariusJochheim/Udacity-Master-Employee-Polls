const Button = ({
  variant = 'primary',
  type = 'button',
  leadingIcon,
  trailingIcon,
  fullWidth = false,
  className = '',
  children,
  ...props
}) => {
  const classes = [
    'ui-button',
    `ui-button-${variant}`,
    fullWidth ? 'is-full-width' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={classes} {...props}>
      {leadingIcon && <span className="button-icon">{leadingIcon}</span>}
      <span className="button-label">{children}</span>
      {trailingIcon && <span className="button-icon">{trailingIcon}</span>}
    </button>
  );
};

export default Button;
