const fs = require("fs");

const cleanupRepository = (repoPaths, retries = 3, delay = 1000) => {
  if (!repoPaths || !Array.isArray(repoPaths) || repoPaths.length === 0) {
    throw new Error("repoPaths is undefined or not an array");
  }

  const cleanupPromises = repoPaths.map((repoPath) => {
    return new Promise((resolve, reject) => {
      const attemptCleanup = (attemptsLeft) => {
        fs.rm(repoPath, { recursive: true, force: true }, (err) => {
          if (err) {
            if (err.code === "EBUSY" && attemptsLeft > 0) {
              console.warn(
                `Retrying cleanup for ${repoPath} due to EBUSY error, ${attemptsLeft} attempts left...`
              );
              setTimeout(() => attemptCleanup(attemptsLeft - 1), delay);
            } else {
              console.error(
                `Error cleaning up repository at ${repoPath}:`,
                err.message
              );
              reject(err);
            }
          } else {
            console.log(`Cleaned up repository at ${repoPath}`);
            resolve();
          }
        });
      };

      attemptCleanup(retries);
    });
  });

  return Promise.all(cleanupPromises)
    .then(() => {
      console.log("All repositories cleaned up successfully.");
    })
    .catch((error) => {
      console.error("Error during cleanup of repositories:", error.message);
    });
};

const cleanAIResponse = (response) => {
  if (!response) {
    throw new Error("AI response is undefined");
  }
  const jsonStart = response.indexOf("{");
  const jsonEnd = response.lastIndexOf("}");

  if (jsonStart !== -1 && jsonEnd !== -1) {
    return response.substring(jsonStart, jsonEnd + 1);
  }

  throw new Error("Invalid JSON format");
};

module.exports = { cleanupRepository, cleanAIResponse };
