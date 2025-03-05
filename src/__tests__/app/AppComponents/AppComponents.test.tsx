import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RootLayout from '@/app/layout';
import { render as customRender } from '../../../../test-utils';
import HomePage from '@/app/page';

jest.mock('@/components/header/header', () => ({
  __esModule: true,
  default: () => <div data-testid="mocked-header" />,
}));

describe('RootLayout', () => {
  it('renders children correctly', () => {
    render(<RootLayout>Test Content</RootLayout>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders the header', () => {
    render(<RootLayout>Test Content</RootLayout>);
    expect(screen.getByTestId('mocked-header')).toBeInTheDocument();
  });

  it('renders <html> with correct lang attribute', () => {
    render(<RootLayout>Test Content</RootLayout>);
    expect(document.documentElement).toHaveAttribute('lang', 'en');
  });

  it('renders <head> with meta tags', () => {
    render(<RootLayout>Test Content</RootLayout>);
    expect(
      document.querySelector(
        'link[rel="preconnect"][href="https://fonts.googleapis.com"]'
      )
    ).toBeInTheDocument();
    expect(document.querySelector('title')).toHaveTextContent('BetaCall');
  });

  it('renders <body> with Providers and children', () => {
    render(<RootLayout>Test Content</RootLayout>);
    expect(document.body).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('render the home page', () => {
    customRender(<HomePage />);
    expect(screen.getByTestId('homePage-testid')).toBeInTheDocument();
  });
});
