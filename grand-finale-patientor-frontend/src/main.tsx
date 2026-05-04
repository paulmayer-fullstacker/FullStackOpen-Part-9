// src/main.tsx:
// Initialisation: entry point of the React application.

import ReactDOM from "react-dom/client";
import App from "./App.tsx";
// Finds the 'root' div in index.html, creates a React root, and renders the App component.
// The '!' is a non-null assertion operator asserting to TS that the element definitely exists.
ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
