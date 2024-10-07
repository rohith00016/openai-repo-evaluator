const express = require("express");
const { cleanupRepository } = require("./utils/cleanup");
const readRepoContents = require("./utils/read");
const cloneRepo = require("./utils/clone");
const { evaluateRepo } = require("./utils/evaluate");
const getCases = require("./utils/cases");
require("dotenv").config();
const app = express();
app.use(express.json());

// Handle CORS errors
app.use(cors({ origin: ["http://localhost:5173"] }));

// Endpoint to evaluate the repository
app.post("/evaluate", async (req, res) => {
  const repo = req.body?.repo; // This can be an array of repository links
  const type = req.body?.type;
  const title = req.body?.title;

  let repoPaths; // Declare repoPaths here for cleanup later

  try {
    // Clone the repositories
    repoPaths = await cloneRepo(repo, type);

    // Read the contents of the cloned repositories
    const combinedCodeContent = readRepoContents(repoPaths);

    // Assign test cases
    const cases = getCases(type, title);

    // Evaluate the repositories
    const aiFeedback = await evaluateRepo(cases, combinedCodeContent);

    // Respond with AI feedback
    res.json({ message: "Evaluation completed", feedback: aiFeedback });
  } catch (err) {
    console.error("Repository evaluation error:", err.message);
    res
      .status(500)
      .json({ error: "Repository evaluation failed", details: err.message });
  } finally {
    // Clean up repositories after evaluation
    await cleanupRepository(repoPaths);
  }
});

// Starting the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
