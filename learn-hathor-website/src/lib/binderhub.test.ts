import { describe, it, expect } from 'vitest';
import {
  getPhaseProgress,
  formatPhase,
  getBuildUrl,
  getNotebookUrl,
  parseBinderHubMessage,
  resolveBranch,
} from '@/lib/binderhub';
import type { Notebook } from '@/types';

describe('binderhub lib', () => {
  describe('getPhaseProgress', () => {
    it('returns 0 for null phase', () => {
      expect(getPhaseProgress(null)).toBe(0);
    });

    it('returns correct progress for each phase', () => {
      expect(getPhaseProgress('waiting')).toBe(10);
      expect(getPhaseProgress('building')).toBe(40);
      expect(getPhaseProgress('pushing')).toBe(70);
      expect(getPhaseProgress('launching')).toBe(90);
      expect(getPhaseProgress('ready')).toBe(100);
      expect(getPhaseProgress('failed')).toBe(0);
    });
  });

  describe('formatPhase', () => {
    it('returns formatted phase names', () => {
      expect(formatPhase('waiting')).toBe('Waiting');
      expect(formatPhase('building')).toBe('Building image');
      expect(formatPhase('pushing')).toBe('Pushing image');
      expect(formatPhase('launching')).toBe('Launching server');
      expect(formatPhase('ready')).toBe('Ready');
      expect(formatPhase('failed')).toBe('Failed');
    });
  });

  describe('resolveBranch', () => {
    it('returns string branch as is', async () => {
      const branch = await resolveBranch('main');
      expect(branch).toBe('main');
    });

    it('resolves function that returns string', async () => {
      const branch = await resolveBranch(() => 'develop');
      expect(branch).toBe('develop');
    });

    it('resolves async function that returns string', async () => {
      const branch = await resolveBranch(async () => 'feature/test');
      expect(branch).toBe('feature/test');
    });

    it('resolves function that returns promise', async () => {
      const branchFn = () => Promise.resolve('v1.0.0');
      const branch = await resolveBranch(branchFn);
      expect(branch).toBe('v1.0.0');
    });
  });

  describe('getBuildUrl', () => {
    it('constructs correct build URL with string branch', async () => {
      const notebook: Notebook = {
        id: 'test',
        name: 'Test',
        description: 'Test notebook',
        repo: 'owner/repo',
        branch: 'main',
        filepath: 'test.ipynb',
        difficulty: 'beginner',
      };

      const url = await getBuildUrl(notebook);
      expect(url).toContain('/build/gh/owner/repo/main');
    });

    it('constructs correct build URL with function branch', async () => {
      const notebook: Notebook = {
        id: 'test',
        name: 'Test',
        description: 'Test notebook',
        repo: 'owner/repo',
        branch: () => 'v1.2.3',
        filepath: 'test.ipynb',
        difficulty: 'beginner',
      };

      const url = await getBuildUrl(notebook);
      expect(url).toContain('/build/gh/owner/repo/v1.2.3');
    });

    it('constructs correct build URL with async function branch', async () => {
      const notebook: Notebook = {
        id: 'test',
        name: 'Test',
        description: 'Test notebook',
        repo: 'owner/repo',
        branch: async () => 'v2.0.0',
        filepath: 'test.ipynb',
        difficulty: 'beginner',
      };

      const url = await getBuildUrl(notebook);
      expect(url).toContain('/build/gh/owner/repo/v2.0.0');
    });

    it('handles branches with slashes', async () => {
      const notebook: Notebook = {
        id: 'test',
        name: 'Test',
        description: 'Test notebook',
        repo: 'owner/repo',
        branch: 'feature/test',
        filepath: 'test.ipynb',
        difficulty: 'beginner',
      };

      const url = await getBuildUrl(notebook);
      expect(url).toContain('feature/test');
    });
  });

  describe('getNotebookUrl', () => {
    it('constructs correct notebook URL', () => {
      const url = getNotebookUrl(
        'https://hub.example.com',
        'abc123',
        'notebooks/test.ipynb'
      );
      expect(url).toBe(
        'https://hub.example.com/lab/tree/notebooks/test.ipynb?token=abc123'
      );
    });
  });

  describe('parseBinderHubMessage', () => {
    it('parses valid JSON message', () => {
      const message = parseBinderHubMessage(
        '{"phase":"building","message":"Step 1/10"}'
      );
      expect(message).toEqual({
        phase: 'building',
        message: 'Step 1/10',
      });
    });

    it('returns null for invalid JSON', () => {
      const message = parseBinderHubMessage('not valid json');
      expect(message).toBeNull();
    });

    it('parses ready message with url and token', () => {
      const message = parseBinderHubMessage(
        '{"phase":"ready","url":"https://hub.example.com","token":"abc123"}'
      );
      expect(message).toEqual({
        phase: 'ready',
        url: 'https://hub.example.com',
        token: 'abc123',
      });
    });
  });
});
