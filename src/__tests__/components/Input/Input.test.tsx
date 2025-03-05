import React from 'react';
import { render, screen } from '../../../../test-utils';
import '@testing-library/jest-dom';
import TextInput from '@/components/input/input';
import userEvent from '@testing-library/user-event';
import { LuTestTube } from 'react-icons/lu';
import { StyledInput } from '@/components/input/style';

describe('Text Input Component', () => {
  it('renders the text input with title', () => {
    render(<TextInput title="Input test" />);
    expect(screen.getByText('Input test')).toBeInTheDocument();
  });

  it('renders the input with error state', () => {
    render(<TextInput error={true} errorText="Invalid input" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('input-error');
  });

  it('renders the input with error and icon (without onIconClick)', () => {
    render(<TextInput error={true} iconElement={LuTestTube} />);
    const icon = screen.getByTestId('icon-textInput');
    expect(icon).toHaveClass('input-icon', 'input-icon-error');
  });

  it('renders the input with icon when error is false', () => {
    render(<TextInput iconElement={LuTestTube} error={false} />);
    const icon = screen.getByTestId('icon-textInput');
    expect(icon).toHaveClass('input-icon');
    expect(icon).not.toHaveClass('input-icon-error');
  });

  it('calls onIconClick when icon is clicked', async () => {
    const handleClick = jest.fn();
    render(
      <TextInput
        error={true}
        iconElement={LuTestTube}
        onIconClick={handleClick}
      />
    );
    const icon = screen.getByTestId('icon-textInput');
    await userEvent.click(icon);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('matches the snapshot', () => {
    const { container } = render(<TextInput />);
    expect(container).toMatchSnapshot();
  });
});

describe('Styled Components (style.ts)', () => {
  it('matches snapshot with default color', () => {
    const { container } = render(<StyledInput />);
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot with custom color', () => {
    const { container } = render(<StyledInput color={'#000'} />);
    expect(container).toMatchSnapshot();
  });
});
