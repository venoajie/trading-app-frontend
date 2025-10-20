
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import RegisterPage from './RegisterPage';

// Mock the ConsentCheckbox component to isolate the RegisterPage logic
vi.mock('../../components/auth/ConsentCheckbox', () => ({
  ConsentCheckbox: ({ formProps }) => (
    <div>
      <input type="checkbox" data-testid="terms-checkbox" {...formProps} />
      <label>I accept the terms</label>
    </div>
  ),
}));

// We wrap the component in MemoryRouter because it contains <Link> components
const renderComponent = () => {
  return render(
    <MemoryRouter>
      <RegisterPage />
    </MemoryRouter>
  );
};

describe('RegisterPage', () => {
  it('should render all form fields and the submit button', () => {
    renderComponent();

    // Check for all inputs by their labels or placeholder
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByTestId('terms-checkbox')).toBeInTheDocument();

    // Check for the register button
    expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
  });

  it('should display validation errors when form is submitted with empty fields', async () => {
    renderComponent();
    
    const registerButton = screen.getByRole('button', { name: /Register/i });
    await userEvent.click(registerButton);

    // Assert that all required validation messages appear
    expect(await screen.findByText('Invalid email address')).toBeInTheDocument();
    expect(await screen.findByText('Password must be at least 8 characters long')).toBeInTheDocument();
    expect(await screen.findByText('You must accept the terms and conditions to continue')).toBeInTheDocument();
  });

  it('should display a validation error for mismatched passwords', async () => {
    renderComponent();

    await userEvent.type(screen.getByLabelText('Password'), 'password123');
    await userEvent.type(screen.getByLabelText(/Confirm Password/i), 'password456');
    
    const registerButton = screen.getByRole('button', { name: /Register/i });
    await userEvent.click(registerButton);

    expect(await screen.findByText('Passwords do not match')).toBeInTheDocument();
  });

  it('should not display validation errors for valid input', async () => {
    renderComponent();

    await userEvent.type(screen.getByLabelText(/Email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password123');
    await userEvent.type(screen.getByLabelText(/Confirm Password/i), 'password123');
    await userEvent.click(screen.getByTestId('terms-checkbox'));
    
    // We don't submit, we just check that after filling the form, errors are not present
    // This is a sanity check. A more robust test would be to submit and check that no errors appear.
    expect(screen.queryByText('Invalid email address')).not.toBeInTheDocument();
    expect(screen.queryByText('Password must be at least 8 characters long')).not.toBeInTheDocument();
    expect(screen.queryByText('Passwords do not match')).not.toBeInTheDocument();
    expect(screen.queryByText('You must accept the terms and conditions to continue')).not.toBeInTheDocument();
  });

  it('should call the submission handler with the correct payload on successful submission', async () => {
    // Spy on console.log to verify the correct payload is constructed
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    renderComponent();

    // Fill the form with valid data
    await userEvent.type(screen.getByLabelText(/Email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password123');
    await userEvent.type(screen.getByLabelText(/Confirm Password/i), 'password123');
    await userEvent.click(screen.getByTestId('terms-checkbox'));

    // Submit the form
    const registerButton = screen.getByRole('button', { name: /Register/i });
    await userEvent.click(registerButton);
    
    // Check that the form submission handler was called
    // And that it logged the correct payload, stripped of UI-only fields
    expect(consoleSpy).toHaveBeenCalledWith('Payload to be sent to API:', {
      email: 'test@example.com',
      password: 'password123',
    });

    // Clean up the spy
    consoleSpy.mockRestore();
  });
});