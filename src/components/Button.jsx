const Button = ({
  as: Component = 'button',
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

  const componentProps = { className: classes, ...props };
  if (Component === 'button') {
    componentProps.type = type;
  }

  return (
    <Component {...componentProps}>
      {leadingIcon && <span className="button-icon">{leadingIcon}</span>}
      <span className="button-label">{children}</span>
      {trailingIcon && <span className="button-icon">{trailingIcon}</span>}
    </Component>
  );
};

export default Button;
