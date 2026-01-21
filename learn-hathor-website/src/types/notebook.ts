/**
 * Notebook difficulty levels
 */
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

/**
 * Represents a Jupyter notebook available for launch
 */
export interface Notebook {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Brief description of what the notebook covers */
  description: string;
  /** GitHub repository in owner/repo format */
  repo: string;
  /** Git branch containing the notebook - can be a string or function that resolves to a string */
  branch: string | (() => string | Promise<string>);
  /** Path to the .ipynb file within the repository */
  filepath: string;
  /** Difficulty level */
  difficulty: Difficulty;
  /** Estimated time to complete (e.g., "15 min") */
  duration?: string;
}

/**
 * Category icon identifier
 */
export type CategoryIcon = 'code' | 'layers' | 'coins' | 'wallet';

/**
 * Represents a category of notebooks
 */
export interface Category {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Brief description of the category */
  description: string;
  /** Icon identifier */
  icon: CategoryIcon;
  /** Notebooks in this category */
  notebooks: Notebook[];
}
