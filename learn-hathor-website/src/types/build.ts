/**
 * Build phase from BinderHub
 */
export type BuildPhase =
  | 'waiting'
  | 'building'
  | 'pushing'
  | 'launching'
  | 'ready'
  | 'failed';

/**
 * Build status states
 */
export type BuildStatus = 'idle' | 'building' | 'ready' | 'error';

/**
 * Message received from BinderHub event stream
 */
export interface BinderHubMessage {
  phase?: BuildPhase;
  message?: string;
  url?: string;
  token?: string;
}

/**
 * Build state managed by useBinderBuild hook
 */
export interface BuildState {
  /** Current build status */
  status: BuildStatus;
  /** Current phase from BinderHub */
  phase: BuildPhase | null;
  /** Status message to display */
  message: string;
  /** Build logs */
  logs: string[];
  /** Progress percentage (0-100) */
  progress: number;
  /** Final notebook URL (when ready) */
  notebookUrl: string | null;
  /** Error message (when failed) */
  error: string | null;
}
