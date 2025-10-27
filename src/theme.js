
// src/theme.js
import { createTheme } from '@mantine/core';

/**
 * This is the central theme configuration for the application.
 * It enforces the visual design language specified in the UX architecture.
 *
 * - Primary Color: 'blue' for deep blues (trust, stability).
 * - Default Theme: Dark theme provides the 'deep grays' for the base.
 * - Accent Colors: Mantine's color palette (e.g., 'yellow' for amber) can be used
 *   for controlled highlights on specific components.
 */
export const theme = createTheme({
  /**
   * The primary color swatch that will be used for all interactive elements,
   * such as buttons, links, and focus rings. We use 'blue' to align with the
   * design principle of trust and stability.
   */
  primaryColor: 'blue',
});