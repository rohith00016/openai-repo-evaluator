const getCases = (type, title) => {
  const casesMap = {
    html: {
      "memory game": [
        "Create a basic HTML layout with a container for the game board.",
        "Include a header with the game title and a restart button.",
        "Implement the game logic to handle card flipping.",
        "Implement a shuffle function to randomize the card positions.",
        "Track the state of the game (flipped cards, found pairs).",
        "Implement logic to check for matching pairs.",
        "Add a restart function that resets the game board.",
        "Clean, well-documented code for HTML, CSS, and JS.",
        "A responsive design for desktop and mobile.",
        "A README file explaining the project setup and play instructions.",
      ],
    },
    node: {
      ecommerce: ["case1", "case2"], 
    },
    react: {
      "shopping cart": [
        "Display a list of available products with their name and description.",
        "Users can add items to the cart by clicking the 'Add to Cart' button.",
        "When an item is added, the cart quantity number should increase.",
        "Change 'Add to Cart' button to 'Remove from Cart' once the item is added.",
        "Users can remove items from the cart by clicking the 'Remove from Cart' button.",
        "When an item is removed, the cart quantity number should decrease.",
        "Change 'Remove from Cart' button back to 'Add to Cart' once the item is removed.",
      ],
    },
    capstone: {
      ecommerce: `Evaluate both the backend API and the frontend React app for an e-commerce application. The evaluation should cover several key areas for both parts. Please assign a total score out of 10, with up to 5 marks allocated for the backend and up to 5 marks for the frontend.
          
        Test Cases:
          
        Backend API (5 Marks)
          
        1. Dependency Check (1 Mark):
           - Verify if necessary npm packages like express, axios, dotenv, cors, and body-parser are installed.
          
        2. Server Configuration (1 Mark):
           - Confirm the application runs on the expected port (e.g., 5000).
          
        3. Endpoint Validation (1 Mark):
           - Check if the /api/chat and /api/messages endpoints are available.
          
        4. Request Validation (1 Mark):
           - Ensure that the request body for POST /api/chat contains necessary fields like userId, message, and timestamp.
          
        5. Token-Based Authentication (1 Mark):
           - Validate the API requires a valid JWT token and handles token expiration correctly.
          
        Frontend React App (5 Marks)
          
        1. Dependency Check (1 Mark):
           - Ensure necessary npm packages like react-router-dom, bootstrap, and axios are installed.
          
        2. Page Existence (1 Mark):
           - Confirm the existence of key pages like Home, Signup, Login, and Cart.
          
        3. Context Management (1 Mark):
           - Verify that the Context API is used effectively for state management (e.g., managing authentication tokens and cart items).
          
        4. Add to Cart Functionality (1 Mark):
           - Test if the "Add to Cart" button triggers a proper API call and adds items to the cart.
          
        5. Error Handling & Validation (1 Mark):
           - Check if API requests handle errors properly and if input validation exists for forms like login and signup.
        `,
    },
  };

  return casesMap[type]?.[title] || [];
};

module.exports = getCases;
