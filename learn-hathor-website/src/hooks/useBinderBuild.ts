import { useCallback, useRef, useState } from 'react';
import type { BuildState, Notebook } from '@/types';
import {
  formatPhase,
  getNotebookUrl,
  getPhaseProgress,
  resolveBranch,
  streamBuild,
} from '@/lib/binderhub';

const initialState: BuildState = {
  status: 'idle',
  phase: null,
  message: '',
  logs: [],
  progress: 0,
  notebookUrl: null,
  error: null,
  repo: null,
  branch: null,
};

/**
 * Hook for managing BinderHub build state
 */
export function useBinderBuild() {
  const [state, setState] = useState<BuildState>(initialState);
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Start building a notebook
   */
  const startBuild = useCallback(async (notebook: Notebook) => {
    // Cancel any existing build
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    // Resolve branch before building
    const resolvedBranch = await resolveBranch(notebook.branch);

    // Reset state
    setState({
      ...initialState,
      status: 'building',
      message: 'Connecting to BinderHub...',
      repo: notebook.repo,
      branch: resolvedBranch,
    });

    await streamBuild(
      notebook,
      {
        onMessage: (message, rawData) => {
          setState((prev) => {
            const newLogs = [...prev.logs];
            if (message.message) {
              newLogs.push(message.message);
            } else if (rawData) {
              newLogs.push(rawData);
            }

            const phase = message.phase || prev.phase;
            const statusMessage = phase
              ? message.message
                ? `${formatPhase(phase)}: ${message.message}`
                : formatPhase(phase)
              : prev.message;

            return {
              ...prev,
              phase,
              message: statusMessage,
              logs: newLogs,
              progress: getPhaseProgress(phase),
            };
          });
        },
        onReady: (url, token) => {
          const notebookUrl = getNotebookUrl(url, token, notebook.filepath);
          setState((prev) => ({
            ...prev,
            status: 'ready',
            phase: 'ready',
            message: 'Environment ready! Opening notebook...',
            progress: 100,
            notebookUrl,
          }));

          // Open notebook in new tab
          setTimeout(() => {
            window.open(notebookUrl, '_blank');
          }, 1000);
        },
        onError: (error) => {
          setState((prev) => ({
            ...prev,
            status: 'error',
            message: error.message,
            error: error.message,
          }));
        },
        onComplete: () => {
          abortControllerRef.current = null;
        },
      },
      abortControllerRef.current.signal
    );
  }, []);

  /**
   * Cancel the current build
   */
  const cancelBuild = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setState((prev) => ({
      ...prev,
      status: 'idle',
      message: 'Build cancelled',
    }));
  }, []);

  /**
   * Reset build state
   */
  const resetBuild = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setState(initialState);
  }, []);

  return {
    ...state,
    startBuild,
    cancelBuild,
    resetBuild,
    isBuilding: state.status === 'building',
    isReady: state.status === 'ready',
    isError: state.status === 'error',
  };
}
