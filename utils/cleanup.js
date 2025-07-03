const fs = require("fs").promises;

/**
 * Cleans up repository directories with retry mechanism
 * @param {string[]} repoPaths - Array of repository paths to clean up
 * @param {number} retries - Number of retry attempts (default: 3)
 * @param {number} delay - Delay between retries in ms (default: 1000)
 * @returns {Promise<void>} Promise that resolves when cleanup is complete
 * @throws {Error} If repoPaths is invalid or cleanup fails
 */
const cleanupRepository = async (repoPaths, retries = 3, delay = 1000) => {
  // Validate input parameters
  if (!repoPaths?.length || !Array.isArray(repoPaths)) {
    throw new Error("Invalid repoPaths: Must be non-empty array of paths");
  }

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const cleanupSingleRepo = async (repoPath, attemptsLeft) => {
    try {
      await fs.rm(repoPath, { recursive: true, force: true });
      console.log(`Successfully cleaned up repository at ${repoPath}`);
    } catch (err) {
      if (err.code === "EBUSY" && attemptsLeft > 0) {
        console.warn(
          `EBUSY error cleaning ${repoPath}, retrying in ${delay}ms (${attemptsLeft} attempts left)`
        );
        await sleep(delay);
        return cleanupSingleRepo(repoPath, attemptsLeft - 1);
      }
      throw new Error(`Failed to clean up ${repoPath}: ${err.message}`);
    }
  };

  try {
    await Promise.all(
      repoPaths.map((path) => cleanupSingleRepo(path, retries))
    );
    console.log("All repositories cleaned up successfully");
  } catch (error) {
    console.error("Repository cleanup failed:", error.message);
    throw error; // Re-throw to allow caller to handle
  }
};

/**
 * Extracts valid JSON from AI response string
 * @param {string} response - Raw AI response text
 * @returns {string} Extracted JSON string
 * @throws {Error} If response is invalid or contains no JSON
 */
const cleanAIResponse = (response) => {
  if (!response?.trim()) {
    throw new Error("Invalid AI response: Empty or undefined");
  }

  const jsonStart = response.indexOf("{");
  const jsonEnd = response.lastIndexOf("}");

  if (jsonStart === -1 || jsonEnd === -1 || jsonStart > jsonEnd) {
    throw new Error("Invalid AI response: No valid JSON found");
  }

  try {
    const jsonStr = response.substring(jsonStart, jsonEnd + 1);
    // Validate JSON is parseable
    JSON.parse(jsonStr);
    return jsonStr;
  } catch (err) {
    throw new Error(`Invalid JSON format: ${err.message}`);
  }
};

module.exports = { cleanupRepository, cleanAIResponse };
