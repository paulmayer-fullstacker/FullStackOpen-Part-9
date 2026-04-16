// main.tsx:

import ReactDOM from 'react-dom/client'  // Import the ReactDOM client API used to render React apps in the browser
import App from './App';  // Import the root App component (your main UI)
// Find the HTML element with id="root" and create a React root inside it. "!" enforces element can NOT be null.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />  // Render the App component into the root element
)
