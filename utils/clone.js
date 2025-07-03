const path = require("path");
const fs = require("fs");
const simpleGit = require("simple-git");

/**
 * Clones one or more Git repositories based on the project type
 * @param {string[]} repos - Array of repository URLs to clone
 * @param {string} type - Project type ('capstone' or other)
 * @returns {string[]} Array of paths to the cloned repositories
 * @throws {Error} If invalid repository configuration provided
 */
const cloneRepo = async (repos, type) => {
  // Input validation
  if (!Array.isArray(repos) || !repos.length || !type) {
    throw new Error("Invalid input parameters");
  }

  const baseDir = process.cwd();
  const repoPaths =
    type === "capstone"
      ? [
          path.join(baseDir, "frontend-cloned-repo"),
          path.join(baseDir, "backend-cloned-repo"),
        ]
      : [path.join(baseDir, "cloned-repo")];

  // Clean up existing directories
  await Promise.all(
    repoPaths.map(async (repoPath) => {
      if (fs.existsSync(repoPath)) {
        console.log(`Cleaning up existing repository at ${repoPath}`);
        await fs.promises.rm(repoPath, { recursive: true, force: true });
      }
    })
  );

  try {
    // Validate repository count matches project type
    const expectedRepoCount = type === "capstone" ? 2 : 1;
    if (repos.length !== expectedRepoCount) {
      throw new Error(
        `Expected ${expectedRepoCount} repositories for ${type} project type`
      );
    }

    // Clone repositories
    const git = simpleGit();
    await Promise.all(
      repos.map(async (repo, index) => {
        console.log(`Cloning repository from ${repo} into ${repoPaths[index]}`);
        await git.clone(repo, repoPaths[index]);
        console.log(`Successfully cloned repository to ${repoPaths[index]}`);
      })
    );

    return repoPaths;
  } catch (error) {
    const errorMessage = `Repository cloning failed: ${error.message}`;
    console.error(errorMessage);
    throw new Error(errorMessage); // Throw error instead of returning incomplete paths
  }
};

module.exports = cloneRepo;
