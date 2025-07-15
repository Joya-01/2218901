import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders URL Shortener form on Home page', () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByText(/URL Shortener/i)).toBeInTheDocument();
});

test('renders statistics on Stats page', () => {
  render(
    <MemoryRouter initialEntries={["/stats"]}>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByText(/statistics/i)).toBeInTheDocument();
});
