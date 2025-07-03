const { cleanAIResponse } = require("./cleanup");
const axios = require("axios");

const evaluateRepo = async (cases, combinedCodeContent) => {
  if (!cases || !combinedCodeContent) {
    throw new Error("Invalid input parameters.");
  }

  try {
    // Make the API call to OpenAI for evaluation
    const aiEvaluation = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4", // Using GPT-4 for better code analysis
        messages: [
          {
            role: "system",
            content:
              "You are an expert code reviewer with deep knowledge of software engineering best practices, design patterns, and security considerations.",
          },
          {
            role: "user",
            content: generateEvaluationContent(cases, combinedCodeContent),
          },
        ],
        max_tokens: 1000, // Increased for more detailed responses
        temperature: 0.5, // Reduced for more consistent responses
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000, // Adding timeout to handle long responses
      }
    );

    // Clean and validate the response
    const responseContent =
      aiEvaluation.data.choices[0]?.message?.content?.trim();
    if (!responseContent) {
      throw new Error("Empty response from OpenAI");
    }

    const cleanResponse = cleanAIResponse(responseContent);

    try {
      const aiFeedback = JSON.parse(cleanResponse);
      return aiFeedback;
    } catch (parseError) {
      throw new Error(`Failed to parse AI response: ${parseError.message}`);
    }
  } catch (error) {
    throw new Error(`Evaluation failed: ${error.message}`);
  }
};

const generateEvaluationContent = (cases, combinedCodeContent) => {
  let content = `Please perform a comprehensive code review and evaluation based on the following test cases and requirements. Provide detailed feedback on code quality, architecture, best practices, and potential improvements:\n`;

  if (!Array.isArray(cases)) {
    content += cases;
  } else {
    cases.forEach((testCase, index) => {
      content += `\nTest Case ${index + 1}: ${testCase}\n`;
    });
  }

  // Improved code content sanitization
  const sanitizedCodeContent = combinedCodeContent
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\t/g, "\\t")
    .replace(/\r/g, "\\r");

  content += `\n\n### Code to Review:\n"${sanitizedCodeContent}"\n\n### Required Output Format:\n`;
  content += `
    \`\`\`json
    {
      "analysis": "<Detailed analysis of the frontend and backend code>",
      "marks": "<Total score out of 10>"
    }
    \`\`\``;

  return content;
};

module.exports = { evaluateRepo };
