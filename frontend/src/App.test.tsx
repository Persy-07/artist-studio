import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Basic Tests', () => {
  test('simple math test', () => {
    expect(2 + 2).toBe(4);
  });

  test('string contains test', () => {
    expect('Artist Studio').toContain('Artist');
  });

  test('renders a div', () => {
    const { container } = render(<div>Test</div>);
    expect(container.firstChild).toBeInTheDocument();
  });
});