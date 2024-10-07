const { cleanAIResponse } = require("./cleanup");
const axios = require("axios");

const evaluateRepo = async (cases, combinedCodeContent) => {
  if (!cases || !combinedCodeContent) {
    throw new Error("Invalid input parameters.");
  }

  // Make the API call to OpenAI for evaluation
  const aiEvaluation = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a code reviewer." },
        {
          role: "user",
          content: generateEvaluationContent(cases, combinedCodeContent),
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  // Clean the response and parse it as JSON
  const cleanResponse = cleanAIResponse(
    aiEvaluation.data.choices[0].message.content.trim()
  );
  const aiFeedback = JSON.parse(cleanResponse);

  return aiFeedback;
};

const generateEvaluationContent = (cases, combinedCodeContent) => {
  let content = `Evaluate the following code and provide scores out of 10 by validating the below test cases:\n`;

  if (!Array.isArray(cases)) {
    content += cases;
  } else {
    cases.forEach((testCase, index) => {
      content += `\nTest Case ${index + 1}: ${testCase}\n`;
    });
  }

  // Ensure the combined code content is properly escaped for JSON
  const sanitizedCodeContent = combinedCodeContent
    .replace(/\\/g, "\\\\") // Escape backslashes
    .replace(/"/g, '\\"') // Escape double quotes
    .replace(/\n/g, "\\n"); // Escape newlines

  content += `\n\n### Code:\n"${sanitizedCodeContent}"\n\n### Expected Output Format:\n`;
  content += `
    \`\`\`json
    {
      "analysis": "<Detailed analysis of the frontend and backend code>",
      "marks": "<Total score out of 10>"
    }
    \`\`\``;

  console.log("content----------", content); // Debugging the generated content

  return content;
};

module.exports = { evaluateRepo };
