import React from 'react';
import { render, screen } from '../../../../test-utils';
import '@testing-library/jest-dom';
import Button from '@/components/button/button';
import {
  FilledButton,
  OutlineButton,
  LeftIconButton,
  IconBox,
} from '@/components/button/style';
import { LuTestTube } from 'react-icons/lu';

describe('Button Component', () => {
  it('renders the button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('renders the button with an icon (IconButton variant)', () => {
    render(
      <Button variant="IconButton" iconElement={LuTestTube}>
        Click me
      </Button>
    );
    expect(screen.getByTestId('icon-component')).toBeInTheDocument();
  });

  it('matches the snapshot', () => {
    const { container } = render(<Button>Snapshot Button</Button>);
    expect(container).toMatchSnapshot();
  });
});

describe('Styled Components (style.ts)', () => {
  describe('FilledButton', () => {
    it('matches snapshot with default height and width', () => {
      const { container } = render(<FilledButton>Test</FilledButton>);
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot with custom height and width', () => {
      const { container } = render(
        <FilledButton buttonHeight="60px" buttonWidth="200px">
          Test
        </FilledButton>
      );
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot for hover styles', () => {
      const { container } = render(
        <FilledButton bgColor="#000" textColor="#fff">
          Test
        </FilledButton>
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('OutlineButton', () => {
    it('matches snapshot with default height and width', () => {
      const { container } = render(<OutlineButton>Test</OutlineButton>);
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot for hover styles', () => {
      const { container } = render(
        <OutlineButton bgColor="#000" textColor="#fff">
          Test
        </OutlineButton>
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('LeftIconButton', () => {
    it('matches snapshot with default width and height', () => {
      const { container } = render(<LeftIconButton>Test</LeftIconButton>);
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot for hover styles', () => {
      const { container } = render(<LeftIconButton>Test</LeftIconButton>);
      expect(container).toMatchSnapshot();
    });
  });

  describe('IconBox', () => {
    it('matches snapshot with fixed dimensions and border radius', () => {
      const { container } = render(<IconBox>Icon</IconBox>);
      expect(container).toMatchSnapshot();
    });
  });
});
