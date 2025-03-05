import React from 'react';
import { render } from '../../../../test-utils';
import '@testing-library/jest-dom';
import Typography from '@/components/typography/typography';

describe('Typography Component', () => {
  describe('typography with variant Button', () => {
    it('renders the typography with fontWeight Bold', () => {
      const { container } = render(
        <Typography variant="Button" weight="Bold">
          Test
        </Typography>
      );
      expect(container).toMatchSnapshot();
    });

    it('renders the typography with fontWeight Regular', () => {
      const { container } = render(
        <Typography variant="Button" weight="Regular">
          Test
        </Typography>
      );
      expect(container).toMatchSnapshot();
    });

    it('renders the typography with fontWeight Small', () => {
      const { container } = render(
        <Typography variant="Button" weight="Small">
          Test
        </Typography>
      );
      expect(container).toMatchSnapshot();
    });

    it('renders the typography with fontWeight Default', () => {
      const { container } = render(
        <Typography variant="Button">Test</Typography>
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('typography with variant Regular', () => {
    it('renders the typography with fontWeight Bold', () => {
      const { container } = render(
        <Typography variant="Regular" weight="Bold">
          Test
        </Typography>
      );
      expect(container).toMatchSnapshot();
    });

    it('renders the typography with fontWeight Regular', () => {
      const { container } = render(
        <Typography variant="Regular" weight="Regular">
          Test
        </Typography>
      );
      expect(container).toMatchSnapshot();
    });

    it('renders the typography with fontWeight Small', () => {
      const { container } = render(
        <Typography variant="Regular" weight="Small">
          Test
        </Typography>
      );
      expect(container).toMatchSnapshot();
    });

    it('renders the typography with fontWeight Default', () => {
      const { container } = render(
        <Typography variant="Regular">Test</Typography>
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('typography with variant SmallRegular', () => {
    it('renders the typography with fontWeight Bold', () => {
      const { container } = render(
        <Typography variant="SmallRegular" weight="Bold">
          Test
        </Typography>
      );
      expect(container).toMatchSnapshot();
    });

    it('renders the typography with fontWeight Regular', () => {
      const { container } = render(
        <Typography variant="SmallRegular" weight="Regular">
          Test
        </Typography>
      );
      expect(container).toMatchSnapshot();
    });

    it('renders the typography with fontWeight Small', () => {
      const { container } = render(
        <Typography variant="SmallRegular" weight="Small">
          Test
        </Typography>
      );
      expect(container).toMatchSnapshot();
    });

    it('renders the typography with fontWeight Default', () => {
      const { container } = render(
        <Typography variant="SmallRegular">Test</Typography>
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('typography with variant Default', () => {
    it('renders the typography with fontWeight Bold', () => {
      const { container } = render(
        <Typography weight="Bold">
          Test
        </Typography>
      );
      expect(container).toMatchSnapshot();
    });

    it('renders the typography with fontWeight Regular', () => {
      const { container } = render(
        <Typography weight="Regular">
          Test
        </Typography>
      );
      expect(container).toMatchSnapshot();
    });

    it('renders the typography with fontWeight Small', () => {
      const { container } = render(
        <Typography weight="Small">
          Test
        </Typography>
      );
      expect(container).toMatchSnapshot();
    });

    it('renders the typography with fontWeight Default', () => {
      const { container } = render(
        <Typography>Test</Typography>
      );
      expect(container).toMatchSnapshot();
    });
  });
});
