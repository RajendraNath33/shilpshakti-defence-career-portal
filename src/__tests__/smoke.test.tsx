// @vitest-environment jsdom
import './setup';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { LanguageProvider } from '../i18n';
import JobFeed from '../components/JobFeed';

describe('JobFeed', () => {
  it('renders without crashing', () => {
    const { container } = render(<LanguageProvider><JobFeed /></LanguageProvider>);
    expect(container.querySelector('#jobs')).not.toBeNull();
  });
});
