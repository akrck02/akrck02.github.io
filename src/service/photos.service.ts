import { getConfiguration } from "../lib/configuration.js";

// ---------------------------------------------------------------------------
// Types — aligned with the API's model.Photo / model.PhotosIndex response.
// ---------------------------------------------------------------------------

/** EXIF metadata for a single photo (API shape). */
export interface PhotoExif {
  camera?: string;
  lens?: string;
  aperture?: string;
  shutter?: string;
  iso?: number;
  focal_length?: string;
  taken_at?: string;
  gps_lat?: number;
  gps_lng?: number;
}

/** A single photo entry as returned by GET /api/photos. */
export interface Photo {
  id: string;
  album: string;
  name: string;
  width: number;
  height: number;
  lqip?: string;
  thumb: string;
  display: string;
  original: string;
  taken_at?: string;
}

/** An album as returned by GET /api/photos. */
export interface Album {
  name: string;
  cover: string;
  count: number;
  photos: Photo[];
}

/** Root response of GET /api/photos. */
export interface PhotosIndex {
  albums: Album[];
}

// ---------------------------------------------------------------------------
// Legacy static types — used for the gh-pages / offline fallback.
// ---------------------------------------------------------------------------

/** Static album shape (committed resources/data). */
export interface StaticAlbum {
  folder: string;
  photos: { [id: string]: string };
}

// ---------------------------------------------------------------------------
// Cache slots
// ---------------------------------------------------------------------------

let photosIndexCache: PhotosIndex | null = null;
let staticIndexCache: { [name: string]: StaticAlbum } | null = null;

// ---------------------------------------------------------------------------
// API-backed loader (Phase 6)
// ---------------------------------------------------------------------------

/**
 * Load the photos index from the backend API when configured, falling back to
 * the static album built from the committed photo list.
 *
 * Strategy:
 *  1. If `api` is set, try GET {api}/api/photos.
 *  2. On any error fall back to the hardcoded static index so gh-pages /
 *     offline continues to work.
 */
export async function loadPhotosIndex(): Promise<PhotosIndex> {
  if (photosIndexCache) return photosIndexCache;

  const apiBase: string = getConfiguration("api") ?? "";

  if (apiBase) {
    try {
      const res = await fetch(`${apiBase}/api/photos`);
      if (res.ok) {
        photosIndexCache = await res.json();
        return photosIndexCache!;
      }
    } catch {
      // Network error — fall through to static fallback.
    }
  }

  // Static fallback: build a PhotosIndex from the hardcoded album.
  photosIndexCache = staticToApiIndex(loadStaticAlbums());
  return photosIndexCache;
}

/**
 * Load EXIF for a single photo by id.
 * Returns null when no API is configured or the request fails.
 */
export async function loadPhotoExif(id: string): Promise<PhotoExif | null> {
  const apiBase: string = getConfiguration("api") ?? "";
  if (!apiBase) return null;

  try {
    const res = await fetch(`${apiBase}/api/photos/${id}/exif`);
    if (res.ok) return res.json();
  } catch {
    // Silently ignore — EXIF is decorative.
  }
  return null;
}

/**
 * Legacy EXIF loader fallback (loads local photos-exif.json if present).
 */
export async function loadPhotosExif(): Promise<{ [id: string]: PhotoExif }> {
  const dataBase = getConfiguration("path")["data"];
  try {
    const res = await fetch(`${dataBase}/photos-exif.json`);
    if (res.ok) return res.json();
  } catch {}
  return {};
}

// ---------------------------------------------------------------------------
// Static fallback (original hardcoded album — kept for gh-pages / offline)
// ---------------------------------------------------------------------------

function loadStaticAlbums(): { [name: string]: StaticAlbum } {
  if (staticIndexCache) return staticIndexCache;

  staticIndexCache = {
    Default: {
      folder: "default",
      photos: {
        DSC06584: "DSC06584.JPG",
        DSC06667: "DSC06667.JPG",
        DSC06691: "DSC06691.JPG",
        DSC06748: "DSC06748.JPG",
        DSC06801: "DSC06801.JPG",
        DSC06840: "DSC06840.JPG",
        DSC06895: "DSC06895.JPG",
        DSC06937: "DSC06937.JPG",
        DSC07029: "DSC07029.JPG",
        DSC07214: "DSC07214.JPG",
        DSC07235: "DSC07235.JPG",
        DSC07252: "DSC07252.JPG",
        DSC07387: "DSC07387.JPG",
        DSC07427: "DSC07427.JPG",
        DSC07454: "DSC07454.JPG",
        DSC07473: "DSC07473.JPG",
        DSC07620: "DSC07620.JPG",
        DSC07651: "DSC07651.JPG",
        DSC07680: "DSC07680.JPG",
        DSC07752: "DSC07752.JPG",
        DSC07826: "DSC07826.JPG",
        DSC07827: "DSC07827.JPG",
        DSC07921: "DSC07921.JPG",
        DSC07966: "DSC07966.JPG",
        DSC07985: "DSC07985.JPG",
        DSC08283: "DSC08283.JPG",
        DSC08311: "DSC08311.JPG",
        DSC08323: "DSC08323.JPG",
        DSC08392: "DSC08392.JPG",
        DSC08668: "DSC08668.JPG",
        DSC08768: "DSC08768.JPG",
        DSC08808: "DSC08808.JPG",
        DSC08858: "DSC08858.JPG",
        DSC08889: "DSC08889.JPG",
        DSC08954: "DSC08954.JPG",
        DSC08987: "DSC08987.JPG",
      },
    },
  };

  return staticIndexCache;
}

/**
 * Convert the legacy static album map into the API PhotosIndex shape so the
 * rest of the app can use a single code path regardless of data source.
 */
function staticToApiIndex(albums: { [name: string]: StaticAlbum }): PhotosIndex {
  const result: PhotosIndex = { albums: [] };

  for (const [albumName, album] of Object.entries(albums)) {
    const photos: Photo[] = Object.entries(album.photos).map(([id, file]) => ({
      id,
      album: album.folder,
      name: file,
      width: 0,
      height: 0,
      // Static paths mirror the old resources/images/photos/<folder>/<tier>/<file> layout.
      thumb: `resources/images/photos/${album.folder}/thumb/${file}`,
      display: `resources/images/photos/${album.folder}/full/${file}`,
      original: `resources/images/photos/${album.folder}/full/${file}`,
    }));

    result.albums.push({
      name: albumName,
      cover: photos[0]?.thumb ?? "",
      count: photos.length,
      photos,
    });
  }

  return result;
}
