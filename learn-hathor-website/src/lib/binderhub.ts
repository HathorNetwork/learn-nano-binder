import type { BinderHubMessage, BuildPhase, Notebook } from '@/types';
import { BINDERHUB_URL } from '@/config';

/**
 * Resolve a notebook's branch to a string
 * Handles both static strings and dynamic functions
 */
export async function resolveBranch(
  branch: string | (() => string | Promise<string>)
): Promise<string> {
  if (typeof branch === 'function') {
    return await branch();
  }
  return branch;
}

/**
 * Build the BinderHub API URL for a notebook
 */
export async function getBuildUrl(notebook: Notebook): Promise<string> {
  const branch = await resolveBranch(notebook.branch);
  const encodedBranch = encodeURIComponent(branch).replace('%2F', '/');
  return `${BINDERHUB_URL}/build/gh/${notebook.repo}/${encodedBranch}`;
}

/**
 * Build the final notebook URL
 */
export function getNotebookUrl(
  baseUrl: string,
  token: string,
  filepath: string
): string {
  return `${baseUrl}/lab/tree/${filepath}?token=${token}`;
}

/**
 * Parse a message from the BinderHub event stream
 */
export function parseBinderHubMessage(data: string): BinderHubMessage | null {
  try {
    return JSON.parse(data) as BinderHubMessage;
  } catch {
    return null;
  }
}

/**
 * Get progress percentage for a build phase
 */
export function getPhaseProgress(phase: BuildPhase | null): number {
  if (!phase) return 0;

  const progressMap: Record<BuildPhase, number> = {
    waiting: 10,
    building: 40,
    pushing: 70,
    launching: 90,
    ready: 100,
    failed: 0,
  };

  return progressMap[phase];
}

/**
 * Format phase name for display
 */
export function formatPhase(phase: BuildPhase): string {
  const phaseNames: Record<BuildPhase, string> = {
    waiting: 'Waiting',
    building: 'Building image',
    pushing: 'Pushing image',
    launching: 'Launching server',
    ready: 'Ready',
    failed: 'Failed',
  };

  return phaseNames[phase];
}

/**
 * Callback types for build stream
 */
export interface BuildStreamCallbacks {
  onMessage: (message: BinderHubMessage, rawData: string) => void;
  onReady: (url: string, token: string) => void;
  onError: (error: Error) => void;
  onComplete: () => void;
}

/**
 * Start streaming build events from BinderHub using EventSource
 * EventSource provides automatic reconnection for long-running builds
 */
export async function streamBuild(
  notebook: Notebook,
  callbacks: BuildStreamCallbacks,
  signal?: AbortSignal
): Promise<void> {
  const buildUrl = await getBuildUrl(notebook);

  return new Promise((resolve) => {
    const eventSource = new EventSource(buildUrl);
    let url: string | null = null;
    let token: string | null = null;
    let completed = false;

    const cleanup = () => {
      if (!completed) {
        completed = true;
        eventSource.close();
        callbacks.onComplete();
        resolve();
      }
    };

    // Handle abort signal
    if (signal) {
      signal.addEventListener('abort', () => {
        cleanup();
      });
    }

    eventSource.onmessage = (event: MessageEvent<string>) => {
      const data = event.data;
      const message = parseBinderHubMessage(data);

      if (message) {
        callbacks.onMessage(message, data);

        // Check if ready
        if (message.phase === 'ready' && message.url && message.token) {
          url = message.url;
          token = message.token;
          callbacks.onReady(url, token);
          cleanup();
        }

        // Check for failure
        if (message.phase === 'failed') {
          callbacks.onError(new Error(message.message || 'Build failed'));
          cleanup();
        }
      }
    };

    eventSource.onerror = (event: Event) => {
      // EventSource will automatically try to reconnect on most errors
      // Only treat it as a fatal error if we haven't received a ready/failed state
      // and the connection is closed
      if (eventSource.readyState === EventSource.CLOSED) {
        // Check if we got a successful build before the connection closed
        if (url && token) {
          callbacks.onReady(url, token);
        } else if (!completed) {
          // Connection closed without success - could be network issue or server timeout
          callbacks.onError(
            new Error(
              'Connection to build server lost. The build may still be in progress - try launching again in a moment.'
            )
          );
        }
        cleanup();
      }
      // If readyState is CONNECTING, EventSource is trying to reconnect automatically
      // We don't need to do anything in that case
      console.debug(
        'EventSource error event, readyState:',
        eventSource.readyState,
        event
      );
    };
  });
}
