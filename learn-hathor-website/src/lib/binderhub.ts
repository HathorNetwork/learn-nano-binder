import type { BinderHubMessage, BuildPhase, Notebook } from '@/types';
import { BINDERHUB_URL } from '@/config';

/**
 * Build the BinderHub API URL for a notebook
 */
export function getBuildUrl(notebook: Notebook): string {
  const encodedBranch = encodeURIComponent(notebook.branch).replace('%2F', '/');
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
 * Start streaming build events from BinderHub
 * Returns an abort controller to cancel the stream
 */
export async function streamBuild(
  notebook: Notebook,
  callbacks: BuildStreamCallbacks,
  signal?: AbortSignal
): Promise<void> {
  const buildUrl = getBuildUrl(notebook);

  try {
    const response = await fetch(buildUrl, { signal });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let url: string | null = null;
    let token: string | null = null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data:')) {
          const data = line.substring(5).trim();
          const message = parseBinderHubMessage(data);

          if (message) {
            callbacks.onMessage(message, data);

            // Check if ready
            if (message.phase === 'ready' && message.url && message.token) {
              url = message.url;
              token = message.token;
            }

            // Check for failure
            if (message.phase === 'failed') {
              throw new Error(message.message || 'Build failed');
            }
          }
        }
      }
    }

    // Build complete
    if (url && token) {
      callbacks.onReady(url, token);
    } else {
      throw new Error('Build completed but no URL received');
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      // Build was cancelled, don't call error callback
      return;
    }
    callbacks.onError(
      error instanceof Error ? error : new Error(String(error))
    );
  } finally {
    callbacks.onComplete();
  }
}
