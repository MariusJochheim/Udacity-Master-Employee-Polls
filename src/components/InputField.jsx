import { useId } from 'react';

const InputField = ({
  id,
  label,
  helperText,
  error,
  className = '',
  type = 'text',
  ...props
}) => {
  const inputId = id || useId();
  const describedBy = error
    ? `${inputId}-error`
    : helperText
      ? `${inputId}-helper`
      : undefined;
  const inputClasses = ['input-control', error ? 'has-error' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <label className="input-field" htmlFor={inputId}>
      {label && <span className="input-label">{label}</span>}
      <input
        id={inputId}
        type={type}
        className={inputClasses}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        {...props}
      />
      {(helperText || error) && (
        <span
          id={describedBy}
          className={`input-helper ${error ? 'input-error' : ''}`}
          role={error ? 'alert' : undefined}
        >
          {error || helperText}
        </span>
      )}
    </label>
  );
};

export default InputField;
