// This file extends the Vitest `expect` functionality with matchers from
// @testing-library/jest-dom, providing more expressive assertions for DOM nodes.
// For example, it allows you to write `expect(element).toBeInTheDocument()`.
// This setup file is automatically run before each test file, as configured
// in `vite.config.ts`.

import '@testing-library/jest-dom';
