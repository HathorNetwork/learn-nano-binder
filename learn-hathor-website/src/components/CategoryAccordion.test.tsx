import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { CategoryAccordion } from '@/components/CategoryAccordion';
import type { Category } from '@/types';

const mockCategory: Category = {
  id: 'test-category',
  name: 'Test Category',
  description: 'Test category description',
  icon: 'code',
  notebooks: [
    {
      id: 'notebook-1',
      name: 'Notebook One',
      description: 'First notebook',
      repo: 'test/repo',
      branch: 'main',
      filepath: 'notebooks/one.ipynb',
      difficulty: 'beginner',
      duration: '10 min',
    },
    {
      id: 'notebook-2',
      name: 'Notebook Two',
      description: 'Second notebook',
      repo: 'test/repo',
      branch: 'main',
      filepath: 'notebooks/two.ipynb',
      difficulty: 'intermediate',
    },
  ],
};

describe('CategoryAccordion', () => {
  it('renders category name', () => {
    render(
      <CategoryAccordion category={mockCategory} onLaunchNotebook={() => {}} />
    );
    expect(screen.getByText('Test Category')).toBeInTheDocument();
  });

  it('renders notebook count', () => {
    render(
      <CategoryAccordion category={mockCategory} onLaunchNotebook={() => {}} />
    );
    expect(screen.getByText('2 notebooks')).toBeInTheDocument();
  });

  it('renders singular notebook count for one notebook', () => {
    const singleNotebookCategory = {
      ...mockCategory,
      notebooks: [mockCategory.notebooks[0]],
    };
    render(
      <CategoryAccordion
        category={singleNotebookCategory}
        onLaunchNotebook={() => {}}
      />
    );
    expect(screen.getByText('1 notebook')).toBeInTheDocument();
  });

  it('is collapsed by default', () => {
    render(
      <CategoryAccordion category={mockCategory} onLaunchNotebook={() => {}} />
    );
    expect(screen.queryByText('Notebook One')).not.toBeInTheDocument();
  });

  it('is expanded when defaultExpanded is true', () => {
    render(
      <CategoryAccordion
        category={mockCategory}
        defaultExpanded
        onLaunchNotebook={() => {}}
      />
    );
    expect(screen.getByText('Notebook One')).toBeInTheDocument();
    expect(screen.getByText('Notebook Two')).toBeInTheDocument();
  });

  it('expands when header is clicked', async () => {
    const { user } = render(
      <CategoryAccordion category={mockCategory} onLaunchNotebook={() => {}} />
    );

    expect(screen.queryByText('Notebook One')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { expanded: false }));

    expect(screen.getByText('Notebook One')).toBeInTheDocument();
  });

  it('collapses when header is clicked again', async () => {
    const { user } = render(
      <CategoryAccordion
        category={mockCategory}
        defaultExpanded
        onLaunchNotebook={() => {}}
      />
    );

    expect(screen.getByText('Notebook One')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { expanded: true }));

    expect(screen.queryByText('Notebook One')).not.toBeInTheDocument();
  });

  it('calls onLaunchNotebook with correct notebook id when launch is clicked', async () => {
    const handleLaunch = vi.fn();
    const { user } = render(
      <CategoryAccordion
        category={mockCategory}
        defaultExpanded
        onLaunchNotebook={handleLaunch}
      />
    );

    const launchButtons = screen.getAllByRole('button', { name: /launch/i });
    await user.click(launchButtons[0]);

    expect(handleLaunch).toHaveBeenCalledWith('notebook-1');
  });
});
