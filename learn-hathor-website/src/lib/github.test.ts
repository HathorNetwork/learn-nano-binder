import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getLatestReleaseTag, useLatestRelease } from './github';

describe('GitHub API utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  describe('getLatestReleaseTag', () => {
    it('should fetch the latest release tag', async () => {
      const mockResponse = {
        tag_name: 'v1.2.3',
        name: 'Release 1.2.3',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const tag = await getLatestReleaseTag('owner/repo');
      
      expect(tag).toBe('v1.2.3');
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.github.com/repos/owner/repo/releases/latest',
        expect.objectContaining({
          headers: {
            Accept: 'application/vnd.github.v3+json',
          },
        })
      );
    });

    it('should throw error when request fails', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      });

      await expect(getLatestReleaseTag('owner/repo')).rejects.toThrow(
        'Failed to fetch latest release: Not Found'
      );
    });

    it('should throw error when tag_name is missing', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await expect(getLatestReleaseTag('owner/repo')).rejects.toThrow(
        'No tag_name found in release data'
      );
    });
  });

  describe('useLatestRelease', () => {
    it('should return a function that fetches the latest release', async () => {
      const mockResponse = {
        tag_name: 'v2.0.0',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const branchResolver = useLatestRelease('owner/repo');
      const tag = await branchResolver();
      
      expect(tag).toBe('v2.0.0');
    });

    it('should cache the result and not fetch again', async () => {
      const mockResponse = {
        tag_name: 'v3.0.0',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const branchResolver = useLatestRelease('owner/repo');
      
      const tag1 = await branchResolver();
      const tag2 = await branchResolver();
      const tag3 = await branchResolver();
      
      expect(tag1).toBe('v3.0.0');
      expect(tag2).toBe('v3.0.0');
      expect(tag3).toBe('v3.0.0');
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should handle concurrent calls with pending promise', async () => {
      const mockResponse = {
        tag_name: 'v4.0.0',
      };

      let resolvePromise: (value: any) => void;
      const delayedPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      (global.fetch as any).mockReturnValueOnce(
        delayedPromise.then(() => ({
          ok: true,
          json: async () => mockResponse,
        }))
      );

      const branchResolver = useLatestRelease('owner/repo');
      
      // Start multiple concurrent calls
      const promise1 = branchResolver();
      const promise2 = branchResolver();
      const promise3 = branchResolver();
      
      // Resolve the fetch
      resolvePromise!({
        ok: true,
        json: async () => mockResponse,
      });
      
      const [tag1, tag2, tag3] = await Promise.all([promise1, promise2, promise3]);
      
      expect(tag1).toBe('v4.0.0');
      expect(tag2).toBe('v4.0.0');
      expect(tag3).toBe('v4.0.0');
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });
});
