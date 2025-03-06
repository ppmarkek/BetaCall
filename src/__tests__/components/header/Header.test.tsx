import React from 'react';
import { fireEvent, render, screen, waitFor } from '../../../../test-utils';
import '@testing-library/jest-dom';
import Header from '@/components/header/header';
import { usePathname } from 'next/navigation';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn().mockReturnValue('/'),
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

describe('Header Component', () => {
  const originalWarn = console.warn;
  beforeAll(() => {
    jest.spyOn(console, 'warn').mockImplementation((msg, ...args) => {
      if (
        typeof msg === 'string' &&
        msg.includes('[@zag-js/dismissable] node is')
      ) {
        return;
      }
      originalWarn(msg, ...args);
    });
  });

  afterAll(() => {
    (console.warn as jest.Mock).mockRestore();
  });

  it('render the hearder', () => {
    render(<Header>test</Header>);
    expect(screen.getByTestId('header-testid')).toBeInTheDocument();
  });

  it('renders correct sign-in/sign-up link based on pathname', () => {
    (usePathname as jest.Mock).mockReturnValue('/signIn');
    render(<Header>test</Header>);
    const link = screen.getByRole('link', { name: /sign up/i });
    expect(link).toHaveAttribute('href', '/signUp');

    (usePathname as jest.Mock).mockReturnValue('/signUp');
    render(<Header>test</Header>);
    const link2 = screen.getByRole('link', { name: /sign in/i });
    expect(link2).toHaveAttribute('href', '/signIn');
  });

  it('authenticated header: clicking outside search container hides the search input', () => {
    document.cookie = 'accessToken=someToken';

    render(<Header>Test Content</Header>);

    const searchBar = screen.getByPlaceholderText(/search.../i);
    fireEvent.click(searchBar);
    fireEvent.mouseDown(document.body);

    expect(searchBar).not.toHaveFocus();
  });

  it('test logout button and check cookie', () => {
    document.cookie = 'accessToken=someToken';

    render(<Header>Test Content</Header>);

    const avatarButton = screen.getByTestId('avatar-button');
    fireEvent.click(avatarButton);
    const logoutButton = screen.getByTestId('logout-button');
    fireEvent.click(logoutButton);

    expect(document.cookie).toBe('');
  });

  it('render header title', async () => {
    document.cookie = 'accessToken=someToken';
    (usePathname as jest.Mock).mockReturnValue('/');
    render(<Header>test</Header>);

    await waitFor(() => {
      expect(screen.getByTestId('header-title')).toHaveTextContent('Dashboard');
    });
  });

  it('open big menu', () => {
    document.cookie = 'accessToken=someToken';

    render(<Header>test</Header>);

    const openBigMenu = screen.getByTestId('open-menu');
    fireEvent.click(openBigMenu);

    expect(screen.getByTestId('authenticated-header')).toHaveStyle('margin-left: 270px');
  })

  it('matches the snapshot', () => {
    const { container } = render(<Header>test</Header>);
    expect(container).toMatchSnapshot();
  });
});
