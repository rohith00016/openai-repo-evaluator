const express = require("express");
const cors = require("cors");
const { cleanupRepository } = require("./utils/cleanup");
const readRepoContents = require("./utils/read");
const cloneRepo = require("./utils/clone");
const { evaluateRepo } = require("./utils/evaluate");
const getCases = require("./utils/cases");
require("dotenv").config();

// Initialize express app with middleware
const app = express();
app.use(express.json());

// Handle CORS errors
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://harmonious-bonbon-222cf5.netlify.app",
    ],
  })
);

// Input validation middleware
const validateInput = (req, res, next) => {
  const { repo, type, title } = req.body;
  if (!repo || !type || !title) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  next();
};

// Endpoint to evaluate the repository
app.post("/evaluate", validateInput, async (req, res) => {
  const { repo, type, title } = req.body;
  let repoPaths;

  try {
    // Clone the repositories
    repoPaths = await cloneRepo(repo, type);
    console.log(repoPaths);

    // Read the contents of the cloned repositories
    const combinedCodeContent = readRepoContents(repoPaths);
    console.log(combinedCodeContent);

    // Get test cases based on type and title
    const cases = await getCases(type, title);

    // Evaluate the repositories
    //const aiFeedback = await evaluateRepo(cases, combinedCodeContent);

    // Respond with AI feedback
    res.json({
      message: "Evaluation completed",
      feedback: combinedCodeContent,
    });
  } catch (err) {
    console.error("Repository evaluation error:", err);
    res.status(500).json({
      success: false,
      error: "Repository evaluation failed",
      details: err.message,
    });
  } finally {
    // Clean up repositories after evaluation
    if (repoPaths) {
      try {
        await cleanupRepository(repoPaths);
      } catch (cleanupErr) {
        console.error("Cleanup error:", cleanupErr);
      }
    }
  }
});

// Starting the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
