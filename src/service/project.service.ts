import { Languages } from "../lib/i18n";
import {
  GlobalCategoryStats,
  CategorySummary,
} from "../model/project/projects";

export default class ProjectService {
  static async getGlobalCategoryStats(): Promise<GlobalCategoryStats> {
    return {
      stats: {
        languages: 6,
        projects: 32,
      },
      summaries: [
        {
          name: "Developer tools",
          projects: 12,
          languages: ["typecript", "html", "css", "golang"],
        },
        { name: "Games", projects: 2, languages: ["gdscript", "C#"] },
        {
          name: "Websites",
          projects: 10,
          languages: ["html", "css", "typescript"],
        },
        { name: "Cli", projects: 8, languages: ["golang"] },
      ],
    };
  }
}
