// Fetches release assets from the GitHub Releases API so game pages can offer
// real downloads. The site is static (GitHub Pages), so these are unauthenticated
// calls — CORS-enabled but rate limited to 60/hr per IP, hence the per-repo cache.

export interface ReleaseAsset {
  name: string;
  url: string;
  size: number;
  platform?: string;
}

export interface Release {
  tag: string;
  name: string;
  url: string;
  assets: ReleaseAsset[];
}

// Map an asset filename to one of the platform keys used by PLATFORM_ICONS.
function platformOf(name: string): string | undefined {
  const n = name.toLowerCase();
  if (/(\.apk$|android)/.test(n)) return "android";
  if (/(\.ipa$|ios)/.test(n)) return "ios";
  if (/(\.exe$|\.msi$|win(dows|32|64)?|\.zip$)/.test(n) && /win/.test(n)) return "windows";
  if (/(\.exe$|\.msi$|windows)/.test(n)) return "windows";
  if (/(\.dmg$|\.pkg$|mac(os)?|osx|darwin)/.test(n)) return "mac";
  if (/(\.appimage$|\.deb$|\.rpm$|\.tar\.gz$|\.tar\.xz$|linux|x86_64)/.test(n)) return "linux";
  if (/(\.html$|web|wasm|html5)/.test(n)) return "web";
  return undefined;
}

// Extract "owner/repo" from a GitHub repo URL like https://github.com/akrck02/foo
function repoSlug(url?: string): string | undefined {
  if (!url) return undefined;
  const match = url.match(/github\.com\/([^/]+\/[^/]+?)(?:\.git|\/)?$/i);
  return match?.[1];
}

const cache: { [slug: string]: Release | null } = {};

// Latest release for a game's repo URL, or null if none / unavailable.
export async function loadLatestRelease(repoUrl?: string): Promise<Release | null> {
  const slug = repoSlug(repoUrl);
  if (!slug) return null;
  if (slug in cache) return cache[slug];

  try {
    const res = await fetch(`https://api.github.com/repos/${slug}/releases/latest`, {
      headers: { Accept: "application/vnd.github+json" }
    });
    if (!res.ok) {
      cache[slug] = null;
      return null;
    }
    const data = await res.json();
    const release: Release = {
      tag: data.tag_name,
      name: data.name || data.tag_name,
      url: data.html_url,
      assets: (data.assets ?? []).map((asset: any) => ({
        name: asset.name,
        url: asset.browser_download_url,
        size: asset.size,
        platform: platformOf(asset.name)
      }))
    };
    cache[slug] = release;
    return release;
  } catch {
    cache[slug] = null;
    return null;
  }
}
