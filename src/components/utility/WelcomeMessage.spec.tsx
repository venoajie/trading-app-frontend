// src/components/utility/WelcomeMessage.spec.tsx
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { describe, it, expect, beforeAll } from 'vitest';
import { WelcomeMessage } from './WelcomeMessage';

// Mock the i18next instance for this test suite to ensure tests are isolated
// and do not depend on the global i18n configuration.
beforeAll(() => {
  i18n.init({
    lng: 'en',
    fallbackLng: 'en',
    resources: {
      en: {
        translation: {
          welcomeMessage: 'Test Welcome Message',
          welcomeSubtitle: 'This is a test subtitle.',
        },
      },
    },
  });
});

describe('WelcomeMessage Component', () => {
  it('should render the welcome message and subtitle from i18n translations', () => {
    // Render the component wrapped in the I18nextProvider to provide the
    // necessary context for the `useTranslation` hook.
    render(
      <I18nextProvider i18n={i18n}>
        <WelcomeMessage />
      </I18nextProvider>
    );

    // Assert that the translated heading is in the document.
    expect(
      screen.getByRole('heading', { name: /Test Welcome Message/i })
    ).toBeInTheDocument();

    // Assert that the translated subtitle text is in the document.
    expect(screen.getByText(/This is a test subtitle./i)).toBeInTheDocument();
  });
});
