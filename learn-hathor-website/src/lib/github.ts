/**
 * GitHub API utilities
 */

/**
 * Fetch the latest release tag from a GitHub repository
 * @param repo Repository in owner/repo format
 * @returns The tag name of the latest release
 * @throws Error if the request fails or no releases are found
 */
export async function getLatestReleaseTag(repo: string): Promise<string> {
  const url = `https://api.github.com/repos/${repo}/releases/latest`;
  
  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch latest release: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.tag_name) {
      throw new Error('No tag_name found in release data');
    }

    return data.tag_name;
  } catch (error) {
    console.error(`Error fetching latest release for ${repo}:`, error);
    throw error;
  }
}

/**
 * Create a branch resolver function that fetches the latest release tag
 * Caches the result to avoid multiple API calls
 * @param repo Repository in owner/repo format
 * @returns Function that returns the latest release tag
 */
export function useLatestRelease(repo: string): () => Promise<string> {
  let cachedTag: string | null = null;
  let pendingPromise: Promise<string> | null = null;

  return async () => {
    if (cachedTag) {
      return cachedTag;
    }

    if (pendingPromise) {
      return pendingPromise;
    }

    pendingPromise = getLatestReleaseTag(repo).then((tag) => {
      cachedTag = tag;
      pendingPromise = null;
      return tag;
    });

    return pendingPromise;
  };
}
