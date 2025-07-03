const fs = require("fs");
const path = require("path");

const readRepoContents = (dirPaths, allFiles = []) => {
  // Move excluded extensions to a constant outside the function
  const EXCLUDED_EXTENSIONS = [
    ".svg",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".mp4",
    ".mp3",
    ".woff",
    ".woff2",
    ".ttf",
    ".lock",
    ".DS_Store",
    ".gitignore",
  ];

  const EXCLUDED_FILES = [".git", "package-lock.json", "node_modules"];

  const paths = Array.isArray(dirPaths) ? dirPaths : [dirPaths];

  try {
    paths.forEach((dirPath) => {
      const files = fs.readdirSync(dirPath);

      files.forEach((file) => {
        // Skip excluded files/directories early
        if (EXCLUDED_FILES.includes(file)) {
          return;
        }

        const filePath = path.join(dirPath, file);
        const stat = fs.statSync(filePath);

        if (stat.isFile()) {
          // Check if file should be excluded based on extension
          const shouldExclude = EXCLUDED_EXTENSIONS.some((ext) =>
            file.endsWith(ext)
          );

          if (!shouldExclude) {
            try {
              const fileContent = fs.readFileSync(filePath, "utf8");
              // Add file path as comment before content for better traceability
              allFiles.push(`// File: ${filePath}\n${fileContent}`);
            } catch (err) {
              console.error(`Error reading file ${filePath}:`, err);
            }
          }
        } else if (stat.isDirectory()) {
          readRepoContents(filePath, allFiles);
        }
      });
    });

    return allFiles.join("\n\n");
  } catch (err) {
    console.error("Error reading repository contents:", err);
    throw err;
  }
};

module.exports = readRepoContents;

// fucntion logic to read the contents of the repository

/**
 * Reads and combines the contents of all relevant files in the given directory paths.
 * Here's how it works:
 * 1. Takes a single path or array of paths as input
 * 2. For each directory path:
 *    - Lists all files/folders in that directory
 *    - For each item found:
 *      a. Skips the .git directory
 *      b. For files:
 *         - Checks against excluded extensions (images, fonts, etc)
 *         - If not excluded, reads the file content and adds to collection
 *      c. For directories:
 *         - Recursively processes that directory
 * 3. Finally combines all file contents with newlines between them
 *
 * @param {string|string[]} dirPaths - Single directory path or array of paths
 * @param {string[]} allFiles - Accumulator array for recursive calls
 * @returns {string} Combined contents of all relevant files
 */
