import { describe, expect, test, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import Avatar from './Avatar';
import Button from './Button';
import Card from './Card';
import EmptyState from './EmptyState';
import InputField from './InputField';
import RadioCard from './RadioCard';
import ScoreBadge from './ScoreBadge';
import Spinner from './Spinner';
import Tabs from './Tabs';

describe('UI components', () => {
  test('Avatar renders consistently (snapshot)', () => {
    const { container } = render(<Avatar name="Jane Doe" alt="Profile" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('Button renders consistently (snapshot)', () => {
    const { container } = render(
      <Button variant="primary" leadingIcon="✓" trailingIcon="→" fullWidth>
        Continue
      </Button>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('EmptyState renders consistently (snapshot)', () => {
    const { container } = render(
      <EmptyState
        title="Nothing here"
        description="Add a poll to get started"
        action={<button type="button">Create poll</button>}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('InputField renders consistently (snapshot)', () => {
    const { container } = render(
      <InputField
        id="email-field"
        label="Email"
        helperText="We will never share your email."
        placeholder="name@example.com"
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('RadioCard renders consistently (snapshot)', () => {
    const { container } = render(
      <RadioCard
        name="poll"
        value="optionOne"
        label="Option One"
        description="This is the first option."
        checked
        onChange={jest.fn()}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('ScoreBadge renders consistently (snapshot)', () => {
    const { container } = render(<ScoreBadge label="Score" score={7} icon="★" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('Spinner renders consistently (snapshot)', () => {
    const { container } = render(<Spinner label="Loading data" className="inline" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('Tabs renders consistently (snapshot)', () => {
    const tabs = [
      { key: 'active', label: 'Active', badge: 2 },
      { key: 'completed', label: 'Completed', badge: 1 },
    ];
    const { container } = render(<Tabs tabs={tabs} activeKey="active" onChange={() => {}} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('Card renders consistently (snapshot)', () => {
    const { container } = render(
      <Card
        title="Snapshot Poll"
        subtitle="Choose wisely"
        accentColor="#123456"
        footer={<span>Footer content</span>}
      >
        <p>Snapshot body</p>
      </Card>
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  test('Button forwards click events and applies variant class', () => {
    const onClick = jest.fn();
    render(
      <Button variant="secondary" onClick={onClick}>
        Click me
      </Button>
    );
    fireEvent.click(screen.getByRole('button', { name: /click me/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button')).toHaveClass('ui-button-secondary');
  });

  test('Card renders header, body, footer, and accent color', () => {
    render(
      <Card
        title="Poll"
        subtitle="Subtitle"
        accentColor="rgb(0, 0, 0)"
        footer={<span>Footer</span>}
      >
        <p>Body text</p>
      </Card>
    );

    expect(screen.getByText('Poll')).toBeInTheDocument();
    expect(screen.getByText('Subtitle')).toBeInTheDocument();
    expect(screen.getByText('Body text')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
    const accent = document.querySelector('.card-accent');
    expect(accent).toHaveStyle({ background: 'rgb(0, 0, 0)' });
  });

  test('Avatar renders initials when no image provided', () => {
    render(<Avatar name="Jane Doe" />);
    expect(screen.getByLabelText(/jane doe/i)).toHaveTextContent('JD');
  });

  test('Tabs marks active tab and calls onChange', () => {
    const onChange = jest.fn();
    const tabs = [
      { key: 'active', label: 'Active' },
      { key: 'completed', label: 'Completed' },
    ];

    render(<Tabs tabs={tabs} activeKey="active" onChange={onChange} />);

    const activeTab = screen.getByRole('tab', { name: /active/i });
    expect(activeTab).toHaveAttribute('aria-selected', 'true');
    fireEvent.click(screen.getByRole('tab', { name: /completed/i }));
    expect(onChange).toHaveBeenCalledWith('completed');
  });

  test('InputField wires label, helper, and error messaging', () => {
    render(<InputField label="Question" helperText="Helper" placeholder="Type here" />);
    const input = screen.getByLabelText(/question/i);
    expect(input).toHaveAttribute('placeholder', 'Type here');
    expect(screen.getByText(/helper/i)).toBeInTheDocument();

    render(<InputField label="Email" error="Required" />);
    const errorInput = screen.getByLabelText(/email/i);
    expect(errorInput).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText(/required/i)).toHaveClass('input-error');
  });

  test('RadioCard indicates checked and disabled states', () => {
    const onChange = jest.fn();
    const { rerender } = render(
      <RadioCard name="poll" value="one" label="Option One" checked onChange={onChange} />
    );
    expect(screen.getByText(/option one/i).closest('label')).toHaveClass('is-checked');
    fireEvent.click(screen.getByRole('radio', { name: /option one/i }));
    // Change event does not fire when already checked; expect no change here
    expect(onChange).toHaveBeenCalledTimes(0);

    rerender(
      <RadioCard
        name="poll"
        value="one"
        label="Option One"
        checked
        disabled
        onChange={onChange}
      />
    );
    expect(screen.getByText(/option one/i).closest('label')).toHaveClass('is-disabled');
  });

  test('ScoreBadge displays label and score', () => {
    render(<ScoreBadge label="Points" score={12} />);
    expect(screen.getByText(/points/i)).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  test('EmptyState renders message and optional action', () => {
    render(<EmptyState title="Nothing here" description="Add a poll" action={<button>New</button>} />);
    expect(screen.getByRole('status')).toHaveTextContent('Nothing here');
    expect(screen.getByRole('button', { name: /new/i })).toBeInTheDocument();
  });

  test('Spinner exposes accessible label', () => {
    render(<Spinner label="Loading data" />);
    expect(screen.getByRole('status', { name: /loading data/i })).toBeInTheDocument();
    expect(document.querySelector('.spinner-circle')).toBeInTheDocument();
  });
});
