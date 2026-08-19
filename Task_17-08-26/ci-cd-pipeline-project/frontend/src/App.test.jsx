import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ status: 'ok' }),
      })
    );
  });

  it('renders the heading', () => {
    render(<App />);
    expect(screen.getByText('Frontend App')).toBeInTheDocument();
  });

  it('shows the backend status once resolved', async () => {
    render(<App />);
    const status = await screen.findByTestId('api-status');
    expect(status).toHaveTextContent('Backend status: ok');
  });
});
