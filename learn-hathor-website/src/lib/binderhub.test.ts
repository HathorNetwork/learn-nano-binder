import { describe, it, expect } from 'vitest';
import {
  getPhaseProgress,
  formatPhase,
  getBuildUrl,
  getNotebookUrl,
  parseBinderHubMessage,
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

  describe('getBuildUrl', () => {
    it('constructs correct build URL', () => {
      const notebook: Notebook = {
        id: 'test',
        name: 'Test',
        description: 'Test notebook',
        repo: 'owner/repo',
        branch: 'main',
        filepath: 'test.ipynb',
        difficulty: 'beginner',
      };

      const url = getBuildUrl(notebook);
      expect(url).toContain('/build/gh/owner/repo/main');
    });

    it('handles branches with slashes', () => {
      const notebook: Notebook = {
        id: 'test',
        name: 'Test',
        description: 'Test notebook',
        repo: 'owner/repo',
        branch: 'feature/test',
        filepath: 'test.ipynb',
        difficulty: 'beginner',
      };

      const url = getBuildUrl(notebook);
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
