# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname
      }
      // other options...
    }
  }
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname
      }
      // other options...
    }
  }
]);
```

## Flight Diary Application

This Flight Diary application is a classic example of a React-TypeScript frontend interacting with a RESTful backend. It manages state for a collection of flight logs, handles user input through a controlled form, and performs asynchronous data fetching and creation.

### App Operation Overview

Initialization: When the app starts, the main.tsx file acts as the entry point, mounting the App component into the DOM.

Data Fetching: Once App is mounted, a useEffect hook triggers an HTTP GET request to the backend. The results are stored in the diaries state, which causes React to render the list of existing entries.

State Management: The app uses several useState hooks to track form inputs (date, visibility, weather, comment). It uses TypeScript Enums for visibility and weather to ensure the data sent to the server perfectly matches the backend's expected categories.

Creating Entries: When the user submits the form:

The browser's default submission is prevented.

An HTTP POST request is sent to the server.

Success Path: If the server accepts the entry, the local diaries state is updated by appending the new object returned by the server. The form is then cleared.

Error Path: If the server rejects the entry (e.g., invalid data), the catch block captures the error message and displays a red notification to the user for 5 seconds.
