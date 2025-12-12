import { useState } from 'react';
import { ChevronDown, Code, Layers, Coins, Wallet } from 'lucide-react';
import type { Category, CategoryIcon } from '@/types';
import { NotebookCard } from './NotebookCard';

interface CategoryAccordionProps {
  category: Category;
  defaultExpanded?: boolean;
  onLaunchNotebook: (notebookId: string) => void;
}

const iconMap: Record<CategoryIcon, typeof Code> = {
  code: Code,
  layers: Layers,
  coins: Coins,
  wallet: Wallet,
};

export function CategoryAccordion({
  category,
  defaultExpanded = false,
  onLaunchNotebook,
}: CategoryAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const Icon = iconMap[category.icon];

  return (
    <div className="bg-bg-card border border-white/10 rounded-xl overflow-hidden transition-colors hover:border-white/20">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors hover:bg-bg-card-hover"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white">
            <Icon size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-text-primary">
              {category.name}
            </h2>
            <p className="text-sm text-text-muted">
              {category.notebooks.length} notebook
              {category.notebooks.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <ChevronDown
          size={24}
          className={`text-text-muted transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {category.notebooks.map((notebook) => (
              <NotebookCard
                key={notebook.id}
                notebook={notebook}
                onLaunch={() => onLaunchNotebook(notebook.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
