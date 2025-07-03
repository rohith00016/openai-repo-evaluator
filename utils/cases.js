const getCases = (type, title) => {
  // Validation for required parameters
  if (!type || !title) {
    throw new Error("Type and title parameters are required");
  }

  // Define test cases for different project types
  const casesMap = {
    html: {
      "memory game": [
        "Create a semantic HTML layout with proper accessibility features",
        "Implement a header with game title, score counter, and restart button",
        "Build responsive game board using CSS Grid/Flexbox",
        "Add smooth card flip animations using CSS transitions",
        "Implement game logic for card matching and state management",
        "Create shuffle algorithm to randomize card positions",
        "Add win condition and game completion modal",
        "Include sound effects for card flips and matches",
        "Ensure mobile-friendly touch interactions",
        "Write comprehensive documentation including setup and gameplay",
      ],
    },
    node: {
      ecommerce: [
        "Implement RESTful API endpoints for products, users, and orders",
        "Add authentication using JWT tokens",
        "Create database models with proper relationships",
        "Add input validation and sanitization",
        "Implement error handling middleware",
        "Add unit tests for core functionality",
        "Create API documentation using Swagger/OpenAPI",
        "Implement rate limiting and security headers",
        "Add logging and monitoring",
        "Create deployment configuration",
      ],
    },
    react: {
      "shopping cart": [
        "Create reusable Product and Cart components",
        "Implement global state management using Context/Redux",
        "Add product listing with filtering and search",
        "Build shopping cart with add/remove functionality",
        "Include quantity controls for cart items",
        "Calculate cart totals and apply discounts",
        "Add form validation for checkout process",
        "Implement responsive design using CSS-in-JS/Sass",
        "Add loading states and error handling",
        "Include unit tests for components",
      ],
    },
    capstone: {
      ecommerce: `Evaluate both the backend API and the frontend React app for an e-commerce application. The evaluation should cover several key areas for both parts. Please assign a total score out of 10, with up to 5 marks allocated for the backend and up to 5 marks for the frontend.

        Test Cases:

        Backend API (5 Marks)

        1. Architecture & Setup (1 Mark):
           - Proper project structure and dependency management
           - Environment configuration and security practices
           - Documentation and API specifications

        2. Core Features (1 Mark):
           - Product management (CRUD operations)
           - User authentication and authorization
           - Order processing and management
           - Cart functionality

        3. Database & Data Management (1 Mark):
           - Database schema design and relationships
           - Data validation and sanitization
           - Query optimization and performance

        4. Security Implementation (1 Mark):
           - JWT authentication with proper expiration
           - Password hashing and secure storage
           - Input validation and sanitization
           - Protection against common vulnerabilities

        5. Error Handling & Logging (1 Mark):
           - Comprehensive error handling
           - Request logging and monitoring
           - Rate limiting and security headers
           - API response formatting

        Frontend React App (5 Marks)

        1. Architecture & Components (1 Mark):
           - Clean component hierarchy
           - Proper state management implementation
           - Code organization and reusability
           - Performance optimization

        2. User Interface (1 Mark):
           - Responsive design implementation
           - Consistent styling and theming
           - Accessibility compliance
           - Loading states and animations

        3. Feature Implementation (1 Mark):
           - Product browsing and search
           - Cart management
           - Checkout process
           - User profile management

        4. State Management (1 Mark):
           - Global state architecture
           - Local state handling
           - API integration
           - Data caching

        5. Testing & Error Handling (1 Mark):
           - Unit and integration tests
           - Error boundary implementation
           - Form validation
           - Fallback UI for errors
        `,
    },
  };

  // Return test cases for given type and title, or empty array if not found
  const cases = casesMap[type]?.[title];
  if (!cases) {
    console.warn(`No test cases found for type: ${type} and title: ${title}`);
    return [];
  }

  return cases;
};

module.exports = getCases;
