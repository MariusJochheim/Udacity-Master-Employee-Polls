import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import InputField from '../components/InputField';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { saveQuestion, selectAuthedUser, selectUi, selectUsers } from '../store';

const MAX_LENGTH = 120;

const NewQuestion = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authedUser = useSelector(selectAuthedUser);
  const users = useSelector(selectUsers);
  const ui = useSelector(selectUi);
  const [optionOne, setOptionOne] = useState('');
  const [optionTwo, setOptionTwo] = useState('');
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useDocumentTitle('New Poll');

  const trimmedOne = optionOne.trim();
  const trimmedTwo = optionTwo.trim();
  const optionsMatch =
    trimmedOne && trimmedTwo && trimmedOne.toLowerCase() === trimmedTwo.toLowerCase();
  const isValid = Boolean(trimmedOne && trimmedTwo && !optionsMatch);
  const saving = ui.savingQuestion || isSubmitting;
  const shouldShowValidation = hasAttemptedSubmit || (trimmedOne && trimmedTwo);

  const authedUserData = authedUser ? users?.[authedUser] : null;

  const optionOneError = (() => {
    if (!shouldShowValidation) return '';
    if (!trimmedOne) return 'Option One is required';
    if (optionsMatch) return 'Options must be different';
    return '';
  })();

  const optionTwoError = (() => {
    if (!shouldShowValidation) return '';
    if (!trimmedTwo) return 'Option Two is required';
    if (optionsMatch) return 'Options must be different';
    return '';
  })();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setHasAttemptedSubmit(true);
    setLocalError('');

    if (!isValid || saving) return;

    setIsSubmitting(true);

    try {
      const question = await dispatch(
        saveQuestion({ optionOneText: trimmedOne, optionTwoText: trimmedTwo })
      );
      if (question?.id) {
        navigate('/', { state: { initialTab: 'active', newQuestionId: question.id } });
      }
      setOptionOne('');
      setOptionTwo('');
    } catch (error) {
      setLocalError(error?.message || 'Unable to create poll. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="panel">
      <header className="poll-detail-header">
        <div>
          <p className="muted">Create a new poll</p>
          <h1>Would You Rather...</h1>
        </div>
        {authedUserData && (
          <div className="poll-meta">
            <span className="muted">Author</span>
            <strong>{authedUserData.name}</strong>
          </div>
        )}
      </header>

      {localError && (
        <div className="app-banner error" role="alert">
          {localError}
        </div>
      )}

      <form className="stack" onSubmit={handleSubmit}>
        <InputField
          label="Option One"
          placeholder="Play soccer with friends"
          value={optionOne}
          onChange={(e) => setOptionOne(e.target.value)}
          maxLength={MAX_LENGTH}
          helperText={`Enter up to ${MAX_LENGTH} characters`}
          error={optionOneError || undefined}
        />

        <InputField
          label="Option Two"
          placeholder="Take a photography class"
          value={optionTwo}
          onChange={(e) => setOptionTwo(e.target.value)}
          maxLength={MAX_LENGTH}
          helperText="Make sure this option is distinct"
          error={optionTwoError || undefined}
        />

        <Card
          className="poll-preview"
          title="Preview"
          subtitle="Your poll will look like this"
          data-testid="poll-preview"
        >
          <p className="muted">Would you rather...</p>
          <h3 className="poll-question">
            {trimmedOne || 'Option One'} <span className="muted">or</span> {trimmedTwo || 'Option Two'}?
          </h3>
        </Card>

        <div className="vote-actions">
          <Button type="submit" variant="primary" disabled={!isValid || saving}>
            {saving ? 'Creating...' : 'Create Poll'}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default NewQuestion;
