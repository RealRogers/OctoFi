import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SwapInterface from './SwapInterface';

describe('SwapInterface', () => {
  it('renders the swap interface correctly', () => {
    render(<SwapInterface />);

    // Check for titles and key elements
    expect(screen.getByRole('heading', { name: /swap/i })).toBeInTheDocument();
    expect(screen.getByText('Desde (Pagas)')).toBeInTheDocument();
    expect(screen.getByText('Hasta (Recibes)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /execute swap/i })).toBeInTheDocument();
  });

  it('updates the "to" amount when "from" amount is changed', () => {
    render(<SwapInterface />);

    const fromInput = screen.getByLabelText(/amount to pay/i);

    // Simulate user typing a number
    fireEvent.change(fromInput, { target: { value: '10' } });

    // Check that the "to" amount updates with the simulated 1.5x ratio
    // The value is in a div, so we check its content
    const toAmountDisplay = screen.getByText('15.00');
    expect(toAmountDisplay).toBeInTheDocument();
  });

  it('shows a validation error for invalid input', async () => {
    render(<SwapInterface />);

    const swapButton = screen.getByRole('button', { name: /execute swap/i });

    // Submit the form with an empty "from" amount
    fireEvent.click(swapButton);

    // Check for the Zod validation message
    const errorMessage = await screen.findByText(/enter a valid amount/i);
    expect(errorMessage).toBeInTheDocument();
  });
});