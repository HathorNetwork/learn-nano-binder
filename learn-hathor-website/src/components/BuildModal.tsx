import { useState } from 'react';
import {
  ChevronDown,
  CheckCircle,
  XCircle,
  GitBranch,
  ExternalLink,
} from 'lucide-react';
import type { BuildState, Notebook } from '@/types';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { ProgressBar } from './ui/ProgressBar';

interface BuildModalProps {
  isOpen: boolean;
  onClose: () => void;
  notebook: Notebook | null;
  buildState: BuildState;
  onCancel: () => void;
}

export function BuildModal({
  isOpen,
  onClose,
  notebook,
  buildState,
  onCancel,
}: BuildModalProps) {
  const [showLogs, setShowLogs] = useState(false);

  const handleClose = () => {
    if (buildState.status === 'building') {
      onCancel();
    }
    onClose();
  };

  const isBuilding = buildState.status === 'building';
  const isReady = buildState.status === 'ready';
  const isError = buildState.status === 'error';

  const handleOpenNotebook = () => {
    if (buildState.notebookUrl) {
      window.open(buildState.notebookUrl, '_blank');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        isReady
          ? 'Environment Ready!'
          : isError
            ? 'Build Failed'
            : 'Building Environment'
      }
      subtitle={notebook?.name}
      footer={
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleClose}>
            {isBuilding ? 'Cancel' : 'Close'}
          </Button>
          {isReady && buildState.notebookUrl && (
            <Button onClick={handleOpenNotebook}>
              <ExternalLink size={16} />
              Open Notebook
            </Button>
          )}
        </div>
      }
    >
      {/* Status */}
      <div
        className={`flex items-center justify-center gap-3 p-4 rounded-lg mb-4 ${
          isReady
            ? 'bg-success-bg'
            : isError
              ? 'bg-error-bg'
              : 'bg-bg-secondary'
        }`}
      >
        {isBuilding && (
          <div className="w-6 h-6 border-2 border-bg-tertiary border-t-primary-500 rounded-full animate-spin" />
        )}
        {isReady && <CheckCircle size={24} className="text-success" />}
        {isError && <XCircle size={24} className="text-error" />}
        <span
          className={`text-sm font-medium ${
            isReady
              ? 'text-success'
              : isError
                ? 'text-error'
                : 'text-text-secondary'
          }`}
        >
          {buildState.message || 'Preparing...'}
        </span>
      </div>

      {/* Progress bar */}
      <ProgressBar progress={buildState.progress} className="mb-4" />

      {/* Repository and branch info */}
      {buildState.repo && buildState.branch && (
        <div className="mb-4 p-3 bg-bg-secondary rounded-lg border border-white/10">
          <div className="flex items-center gap-2 text-sm">
            <GitBranch size={16} className="text-text-tertiary" />
            <span className="text-text-secondary">
              <span className="text-text-primary font-medium">
                {buildState.repo}
              </span>
              {' @ '}
              <span className="text-primary-400 font-mono">
                {buildState.branch}
              </span>
            </span>
          </div>
        </div>
      )}

      {/* Logs toggle */}
      <div className="border border-white/10 rounded-lg overflow-hidden">
        <button
          onClick={() => setShowLogs(!showLogs)}
          className="w-full px-4 py-3 flex items-center justify-between text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
        >
          <span>{showLogs ? 'Hide' : 'Show'} build logs</span>
          <ChevronDown
            size={20}
            className={`transition-transform duration-200 ${showLogs ? 'rotate-180' : ''}`}
          />
        </button>

        {showLogs && (
          <div className="max-h-60 overflow-y-auto bg-bg-primary border-t border-white/10">
            <pre className="p-4 text-xs font-mono text-text-secondary whitespace-pre-wrap break-all">
              {buildState.logs.length > 0
                ? buildState.logs.join('\n')
                : 'Waiting for logs...'}
            </pre>
          </div>
        )}
      </div>
    </Modal>
  );
}
