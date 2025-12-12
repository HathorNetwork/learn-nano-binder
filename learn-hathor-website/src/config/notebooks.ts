import type { Category } from '@/types';

/**
 * BinderHub instance URL
 * Update this if using a different BinderHub deployment
 */
export const BINDERHUB_URL = 'http://35.223.144.166';

/**
 * All notebook categories with their notebooks
 */
export const categories: Category[] = [
  {
    id: 'nano-contracts',
    name: 'Nano Contracts',
    description: 'Learn to build Python-powered smart contracts on Hathor',
    icon: 'code',
    notebooks: [
      {
        id: 'hathordice-tutorial',
        name: 'Creating a Hathor Blueprint: HathorDice Tutorial',
        description:
          'Learn how to create a nanocontract blueprint on Hathor. Walk through building a simple HathorDice contract, understanding blueprints, decorators, syscalls, and testing.',
        repo: 'luislhl/my-first-binder',
        branch: 'chore/nano-tutorials',
        filepath: 'notebooks/01-blueprint-basics/Blueprint.ipynb',
        difficulty: 'beginner',
        duration: '20 min',
      },
      // Add more Nano Contracts notebooks here
    ],
  }
];

/**
 * Get all notebooks from all categories
 */
export function getAllNotebooks() {
  return categories.flatMap((category) => category.notebooks);
}

/**
 * Get a notebook by its ID
 */
export function getNotebookById(id: string) {
  return getAllNotebooks().find((notebook) => notebook.id === id);
}

/**
 * Get categories that have at least one notebook
 */
export function getCategoriesWithNotebooks() {
  return categories.filter((category) => category.notebooks.length > 0);
}
