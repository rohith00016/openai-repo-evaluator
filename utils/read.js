const fs = require("fs");
const path = require("path");

const readRepoContents = (dirPaths, allFiles = []) => {
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
        ".gitignore",];

      // Skip the .git directory
      if (file === ".git") {
        return;
      }

      if (stat.isFile()) {
        if (
          !excludedExtensions.some(
            (ext) => file.endsWith(ext) || file === "package-lock.json"
          )
        ) {
          const fileContent = fs.readFileSync(filePath, "utf8");
          allFiles.push(fileContent);
        }
      } else if (stat.isDirectory()) {
        readRepoContents(filePath, allFiles);
      }
    });
  });

  const combinedContent = allFiles.join("\n\n");
  return combinedContent;
};

module.exports = readRepoContents;
