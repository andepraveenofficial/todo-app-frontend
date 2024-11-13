import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import pluginReact from 'eslint-plugin-react';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier'; // Add this import
import importPlugin from 'eslint-plugin-import'; // Import ESLint Plugin Import

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      parser: tsParser, // Specify the parser for TypeScript files
      globals: globals.browser, // Define global variables
    },
    settings: {
      react: {
        version: 'detect', // Detect React version
      },
    },

    rules: {},

    plugins: {
      prettier: prettier, // Use Prettier as a plugin object
      '@typescript-eslint': tseslint, // Add TypeScript ESLint as a plugin object
      react: pluginReact, // Add React plugin as an object
      import: importPlugin, // Add ESLint Plugin Import as an object
    },
  },

  {
    rules: {
      // Additional rules from TypeScript ESLint
      ...tseslint.configs.recommended.rules,
    },
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    /* -----> Override the Rules <----- */
    // Write your own rules
    rules: {
      'react/react-in-jsx-scope': 'off',
      'no-unused-vars': 'error', // Unused variables
      indent: ['error', 2], // Indentation
      quotes: ['error', 'single'], // Strings must be in single quotes
      'no-console': 'warn', // Allow console statements but warn
      'no-debugger': 'error', // Throw an error if the debugger statement is used
      eqeqeq: ['error', 'always'], // Use === and !== instead of == and !=
      semi: ['error', 'always'], // Use semicolons at the end of statements
      curly: ['error', 'all'], // Require curly braces for all control statements
      camelcase: 'error', // Use camelCase for variable and function names
      'no-trailing-spaces': 'error', // Disallow trailing whitespace at the end of lines
      'sonarjs/cognitive-complexity': ['error', 15], // SonarJS rule
      'sonarjs/no-duplicate-string': ['error', { threshold: 5 }], // Corrected SonarJS rule with object
      'import/order': [
        'error',
        {
          groups: [
            ['builtin', 'external'],
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always', // Enforce new lines between different groups
        },
      ],
    },
  },
];
