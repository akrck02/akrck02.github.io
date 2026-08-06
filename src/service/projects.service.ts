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
  archived: boolean;
  featured: boolean;
}

export interface ProjectsIndex {
  software: Project[];
  games: Project[];
}

let cache: ProjectsIndex;

export async function loadProjects(): Promise<ProjectsIndex> {
  if (cache) return cache;
  const base = getConfiguration("path")["data"];
  cache = await fetch(`${base}/projects.json`).then((res) => res.json());
  return cache;
}
