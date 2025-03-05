import React from 'react';
import { render, screen } from '../../../../test-utils';
import '@testing-library/jest-dom';
import Header from '@/components/header/header';
import { usePathname } from 'next/navigation';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('Header Component', () => {
  it('render the hearder', () => {
    render(<Header />);
    expect(screen.getByTestId('header-testid')).toBeInTheDocument();
  });

  it('renders correct sign-in/sign-up link based on pathname', () => {
    (usePathname as jest.Mock).mockReturnValue('/signIn');
    render(<Header />);
    const link = screen.getByRole('link', { name: /sign up/i });
    expect(link).toHaveAttribute('href', '/signUp');

    (usePathname as jest.Mock).mockReturnValue('/signUp');
    render(<Header />);
    const link2 = screen.getByRole('link', { name: /sign in/i });
    expect(link2).toHaveAttribute('href', '/signIn');
  });

  it('matches the snapshot', () => {
    const { container } = render(<Header />);
    expect(container).toMatchSnapshot();
  });
});
