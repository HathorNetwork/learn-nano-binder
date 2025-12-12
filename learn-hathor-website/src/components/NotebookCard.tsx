import { useState } from 'react';
import { BookOpen, Clock, Rocket, ChevronDown, ChevronUp } from 'lucide-react';
import type { Difficulty, Notebook } from '@/types';
import { Button } from './ui/Button';
import { Card, CardContent, CardFooter } from './ui/Card';

interface NotebookCardProps {
  notebook: Notebook;
  onLaunch: () => void;
}

const difficultyStyles: Record<Difficulty, string> = {
  beginner: 'bg-success-bg text-success',
  intermediate: 'bg-warning-bg text-warning',
  advanced: 'bg-error-bg text-error',
};

export function NotebookCard({ notebook, onLaunch }: NotebookCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card hover>
      <CardContent className="pt-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-bg-tertiary flex items-center justify-center text-cyan-400 flex-shrink-0">
            <BookOpen size={20} />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-text-primary truncate">
              {notebook.name}
            </h3>
            <span
              className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full uppercase tracking-wide ${difficultyStyles[notebook.difficulty]}`}
            >
              {notebook.difficulty}
            </span>
          </div>
        </div>
        <p className={`text-sm text-text-secondary leading-relaxed ${isExpanded ? '' : 'line-clamp-3'}`}>
          {notebook.description}
        </p>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
        >
          {isExpanded ? (
            <>
              Show less <ChevronUp size={14} />
            </>
          ) : (
            <>
              Read more <ChevronDown size={14} />
            </>
          )}
        </button>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-text-muted">
          {notebook.duration && (
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {notebook.duration}
            </span>
          )}
        </div>
        <Button size="sm" onClick={onLaunch}>
          <Rocket size={16} />
          Launch
        </Button>
      </CardFooter>
    </Card>
  );
}
