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
  it('renders FilledButton with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('renders OutlineButton correctly', () => {
    render(<Button variant="Outline">Outline Button</Button>);
    expect(screen.getByText('Outline Button')).toBeInTheDocument();
  });

  it('renders IconButton variant with icon', () => {
    render(
      <Button variant="IconButton" iconElement={LuTestTube}>
        Icon Button
      </Button>
    );
    expect(screen.getByTestId('icon-component')).toBeInTheDocument();
  });

  it('matches snapshot for FilledButton', () => {
    const { container } = render(<Button>Snapshot FilledButton</Button>);
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot for OutlineButton', () => {
    const { container } = render(
      <Button variant="Outline">Snapshot OutlineButton</Button>
    );
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot for IconButton', () => {
    const { container } = render(
      <Button variant="IconButton" iconElement={LuTestTube}>
        Snapshot IconButton
      </Button>
    );
    expect(container).toMatchSnapshot();
  });
});

describe('Styled Components (style.ts)', () => {
  describe('FilledButton', () => {
    it('renders with default properties', () => {
      const { container } = render(<FilledButton>Filled</FilledButton>);
      expect(container).toMatchSnapshot();
    });

    it('renders with custom properties', () => {
      const { container } = render(
        <FilledButton
          buttonHeight="60px"
          buttonWidth="200px"
          bgColor="#123456"
          textColor="#abcdef"
        >
          Custom Filled
        </FilledButton>
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('OutlineButton', () => {
    it('renders with default properties', () => {
      const { container } = render(<OutlineButton>Outline</OutlineButton>);
      expect(container).toMatchSnapshot();
    });

    it('renders with custom properties', () => {
      const { container } = render(
        <OutlineButton
          buttonHeight="60px"
          buttonWidth="200px"
          bgColor="#654321"
          textColor="#fedcba"
        >
          Custom Outline
        </OutlineButton>
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('LeftIconButton', () => {
    it('renders correctly', () => {
      const { container } = render(<LeftIconButton>Left Icon</LeftIconButton>);
      expect(container).toMatchSnapshot();
    });
  });

  describe('IconBox', () => {
    it('renders correctly', () => {
      const { container } = render(<IconBox>IconBox</IconBox>);
      expect(container).toMatchSnapshot();
    });
  });
});
