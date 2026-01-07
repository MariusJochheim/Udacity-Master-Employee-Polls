const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

const Avatar = ({ src, name = '', size = 'md', className = '', alt }) => {
  const initials = getInitials(name);
  const classes = [
    'avatar',
    size === 'sm' ? 'avatar-sm' : '',
    size === 'lg' ? 'avatar-lg' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes} aria-label={alt || name || 'User avatar'}>
      {src ? <img src={src} alt={alt || name || 'User avatar'} /> : initials || '?'}
    </span>
  );
};

export default Avatar;
