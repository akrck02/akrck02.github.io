export enum ProjectCategory {
  Games = "game",
  DeveloperTools = "developer-tool",
  Websites = "website",
  App = "app",
  Cli = "cli",
}

export type CodeProject = {
  name: string;
  description: string;
  git: string;
  category: ProjectCategory;
  technologies: string[];
  languages: string[];
  releases: string[];
};

export type CategorySummary = {
  name: string;
  projects: number;
  languages: string[];
};

export type GlobalCategoryStats = {
  stats: {
    languages: number;
    projects: number;
  };
  summaries: CategorySummary[];
};
