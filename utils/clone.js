const path = require("path");
const fs = require("fs");
const simpleGit = require("simple-git");

const cloneRepo = async (repos, type) => {
  const baseDir = process.cwd();
  let repoPaths;

  if (type === "capstone") {
    repoPaths = [
      path.join(baseDir, "frontend-cloned-repo"),
      path.join(baseDir, "backend-cloned-repo"),
    ];
  } else {
    repoPaths = [path.join(baseDir, "cloned-repo")];
  }

  // Clean up the repo directories if they already exist
  for (const repoPath of repoPaths) {
    if (fs.existsSync(repoPath)) {
      console.log(
        `Repository at ${repoPath} already exists. Cleaning it up first...`
      );
      fs.rmSync(repoPath, { recursive: true, force: true });
    }
  }

  // Clone the repositories based on the type
  try {
    if (type === "capstone") {
      if (repos.length === 2) {
        console.log(
          `Cloning frontend repository from ${repos[0]} into ${repoPaths[0]}`
        );
        await simpleGit().clone(repos[0], repoPaths[0]);
        console.log("Frontend repository cloned successfully");

        console.log(
          `Cloning backend repository from ${repos[1]} into ${repoPaths[1]}`
        );
        await simpleGit().clone(repos[1], repoPaths[1]);
        console.log("Backend repository cloned successfully");
      } else {
        throw new Error(
          "Invalid number of repositories provided for capstone."
        );
      }
    } else {
      // For other types, expect a single repository link
      if (repos.length === 1) {
        console.log(`Cloning repository from ${repos[0]} into ${repoPaths[0]}`);
        await simpleGit().clone(repos[0], repoPaths[0]);
        console.log("Repository cloned successfully");
      } else {
        throw new Error("Invalid repository link provided.");
      }
    }
  } catch (err) {
    console.error("Error during repository cloning:", err.message);
    return repoPaths; // Return the paths even if cloning fails
  }

  return repoPaths; // Return the paths to the cloned repositories
};

module.exports = cloneRepo;
