module.exports = {
  // Specify the environments where your code will run
  env: {
    browser: true, // For browser-based projects
    node: true,    // For Node.js projects
    es6: true,     // For ES6 features
  },
  // Define the set of rules you want to enforce
  extends: 'eslint:recommended', // You can extend other ESLint configurations here

  parser: "@babel/eslint-parser",
  parserOptions: {
    sourceType: "module",
    allowImportExportEverywhere: true
  },

  // Add any custom rules or overrides
  rules: {
    // Example custom rule: disallow the use of console.log()
    'no-console': 'error',
    
    // Add more rules or customize as needed
  },
  ignorePatterns: ['static/admin'],
};