import '@testing-library/jest-dom';
import 'isomorphic-fetch';
import { createSerializer } from '@emotion/jest';
expect.addSnapshotSerializer(createSerializer());

jest.spyOn(console, 'error').mockImplementation((...args) => {
  const message = args
    .map((arg) => (typeof arg === 'string' ? arg : JSON.stringify(arg)))
    .join(' ');
  if (message.includes('In HTML, <html> cannot be a child of <div>')) {
    return;
  }
});
