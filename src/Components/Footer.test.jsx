import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Footer from './Footer';

const renderFooter = () =>
  render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>
  );

describe('Footer', () => {
  test('renders footer links', () => {
    renderFooter();
    expect(screen.getByText('Terms of Use')).toBeInTheDocument();
    expect(screen.getByText('Privacy')).toBeInTheDocument();
  });

  test('each footer link points to its own info page', () => {
    renderFooter();
    const termsLink = screen.getByText('Terms of Use').closest('a');
    expect(termsLink).toHaveAttribute('href', '/info/terms-of-use');
  });

  test('language selector toggles the language list', () => {
    renderFooter();
    expect(screen.queryByText('हिन्दी')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('English'));

    expect(screen.getByText('हिन्दी')).toBeInTheDocument();
  });
});