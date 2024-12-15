import { render, screen, fireEvent } from '@testing-library/react';
import { PostAnalytics } from '../PostAnalytics';
import { mockPost } from '../__mocks__/mockData';
import { describe, it, expect, jest } from '@jest/globals';

describe('PostAnalytics', () => {
  it('renders loading skeleton when isLoading is true', () => {
    render(<PostAnalytics post={mockPost} />);
    expect(screen.getByTestId('post-analytics-skeleton')).toBeInTheDocument();
  });

  it('renders error state when there is an error', () => {
    const onRetry = jest.fn();
    render(<PostAnalytics post={mockPost} onRetry={onRetry} />);
    expect(screen.getByText(/Failed to update metrics/i)).toBeInTheDocument();
  });

  it('renders metrics when data is loaded', () => {
    render(<PostAnalytics post={mockPost} />);
    expect(screen.getByText(/Post Performance/i)).toBeInTheDocument();
  });

  it('handles retry action when error occurs', () => {
    const onRetry = jest.fn();
    render(<PostAnalytics post={mockPost} onRetry={onRetry} />);
    const retryButton = screen.getByRole('button', { name: /retry/i });
    fireEvent.click(retryButton);
    expect(onRetry).toHaveBeenCalled();
  });
});