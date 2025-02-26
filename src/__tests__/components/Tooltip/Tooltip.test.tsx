import React from 'react';
import { render } from '../../../../test-utils';
import '@testing-library/jest-dom';
import { Tooltip } from '@/components/ui/tooltip';

describe('Tooltop Component', () => {
  it('render the tooltip with disabled prop', () => {
    const { container } = render(
      <Tooltip content={undefined} disabled>
        Test
      </Tooltip>
    );
    expect(container).toMatchSnapshot();
  });
});
