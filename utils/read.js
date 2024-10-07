const fs = require("fs");
const path = require("path");

const readRepoContents = (dirPaths, allFiles = []) => {
  // Ensure dirPaths is an array
  const paths = Array.isArray(dirPaths) ? dirPaths : [dirPaths];

  paths.forEach((dirPath) => {
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);

      const excludedExtensions = [
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
        "package-lock.json", // Exclude package-lock.json
      ];

      // Skip the .git directory
      if (file === ".git") {
        return;
      }

      if (stat.isFile()) {
        // Check if the file extension or file name is excluded
        if (
          !excludedExtensions.some(
            (ext) => file.endsWith(ext) || file === "package-lock.json"
          )
        ) {
          const fileContent = fs.readFileSync(filePath, "utf8");
          allFiles.push(fileContent); // Collect only the file content
        }
      } else if (stat.isDirectory()) {
        // Recursively read the directory
        readRepoContents(filePath, allFiles);
      }
    });
  });

  // Combine all file contents into a single string
  const combinedContent = allFiles.join("\n\n"); // Join with some spacing
  console.log("combinedContent:", combinedContent); // Optional: for debugging
  return combinedContent;
};

module.exports = readRepoContents;
