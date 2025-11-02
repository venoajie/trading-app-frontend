// src/components/utility/WelcomeMessage.tsx

import { Title, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';

/**
 * A simple component to demonstrate and validate the i18n setup.
 * It uses the `useTranslation` hook to fetch and display localized strings.
 */
export function WelcomeMessage() {
  const { t } = useTranslation();

  return (
    <>
      <Title order={1} ta="center">
        {t('welcomeMessage')}
      </Title>
      <Text c="dimmed" size="lg" ta="center" mt="sm">
        {t('welcomeSubtitle')}
      </Text>
    </>
  );
}
