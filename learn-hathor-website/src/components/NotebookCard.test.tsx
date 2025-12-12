import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { NotebookCard } from '@/components/NotebookCard';
import type { Notebook } from '@/types';

const mockNotebook: Notebook = {
  id: 'test-notebook',
  name: 'Test Notebook',
  description: 'This is a test notebook description.',
  repo: 'test/repo',
  branch: 'main',
  filepath: 'notebooks/test.ipynb',
  difficulty: 'beginner',
  duration: '15 min',
};

describe('NotebookCard', () => {
  it('renders notebook name', () => {
    render(<NotebookCard notebook={mockNotebook} onLaunch={() => {}} />);
    expect(screen.getByText('Test Notebook')).toBeInTheDocument();
  });

  it('renders notebook description', () => {
    render(<NotebookCard notebook={mockNotebook} onLaunch={() => {}} />);
    expect(
      screen.getByText('This is a test notebook description.')
    ).toBeInTheDocument();
  });

  it('renders difficulty badge', () => {
    render(<NotebookCard notebook={mockNotebook} onLaunch={() => {}} />);
    expect(screen.getByText('beginner')).toBeInTheDocument();
  });

  it('renders duration when provided', () => {
    render(<NotebookCard notebook={mockNotebook} onLaunch={() => {}} />);
    expect(screen.getByText('15 min')).toBeInTheDocument();
  });

  it('does not render duration when not provided', () => {
    const notebookWithoutDuration = { ...mockNotebook, duration: undefined };
    render(
      <NotebookCard notebook={notebookWithoutDuration} onLaunch={() => {}} />
    );
    expect(screen.queryByText('15 min')).not.toBeInTheDocument();
  });

  it('calls onLaunch when launch button is clicked', async () => {
    const handleLaunch = vi.fn();
    const { user } = render(
      <NotebookCard notebook={mockNotebook} onLaunch={handleLaunch} />
    );

    await user.click(screen.getByRole('button', { name: /launch/i }));
    expect(handleLaunch).toHaveBeenCalledTimes(1);
  });

  it('applies correct color for beginner difficulty', () => {
    render(<NotebookCard notebook={mockNotebook} onLaunch={() => {}} />);
    const badge = screen.getByText('beginner');
    expect(badge).toHaveClass('text-success');
  });

  it('applies correct color for intermediate difficulty', () => {
    const intermediateNotebook = {
      ...mockNotebook,
      difficulty: 'intermediate' as const,
    };
    render(
      <NotebookCard notebook={intermediateNotebook} onLaunch={() => {}} />
    );
    const badge = screen.getByText('intermediate');
    expect(badge).toHaveClass('text-warning');
  });

  it('applies correct color for advanced difficulty', () => {
    const advancedNotebook = {
      ...mockNotebook,
      difficulty: 'advanced' as const,
    };
    render(<NotebookCard notebook={advancedNotebook} onLaunch={() => {}} />);
    const badge = screen.getByText('advanced');
    expect(badge).toHaveClass('text-error');
  });
});
