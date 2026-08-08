import { getConfiguration } from "../lib/configuration.js";

export interface Project {
  id: string;
  name: string;
  description: string;
  language: string;
  stack?: string[];
  engine?: string;
  stars: number;
  tags: string[];
  url: string;
  website?: string;
  docs?: string;
  archived: boolean;
  featured: boolean;
  platforms?: string[];
  status?: string;
  screenshots?: number;
}

export interface ProjectsIndex {
  software: Project[];
  games: Project[];
}

let cache: ProjectsIndex;

/**
 * Load the projects index.
 *
 * Strategy (API-first with static fallback):
 *  1. If `api` is configured, try GET {api}/api/projects.
 *  2. On any error (network, non-200, parse failure) fall back to the
 *     committed resources/data/projects.json so gh-pages and offline work.
 *
 * The result is cached for the lifetime of the page.
 */
export async function loadProjects(): Promise<ProjectsIndex> {
  if (cache) return cache;

  const apiBase: string = getConfiguration("api") ?? "";

  if (apiBase) {
    try {
      const res = await fetch(`${apiBase}/api/projects`);
      if (res.ok) {
        cache = await res.json();
        return cache;
      }
    } catch {
      // Network error — fall through to static fallback.
    }
  }

  // Static fallback: committed projects.json (always present on gh-pages).
  const dataBase = getConfiguration("path")["data"];
  cache = await fetch(`${dataBase}/projects.json`).then((res) => res.json());
  return cache;
}
