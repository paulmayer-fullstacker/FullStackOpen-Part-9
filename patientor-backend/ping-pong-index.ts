// index.ts:

import express from "express"; // Import the Express framework to handle HTTP requests.
import cors from "cors"; // Install cors and inport: npm install cors, npm install --save-dev @types/cors.

const corsWhiteList = {
  origin: "http://localhost:3000", // Only allow requests from our frontend
};
const app = express(); // Initialise the 'app' variable by calling the express function.
app.use(cors(corsWhiteList)); // Use CORS, which will add 'Access-Control-Allow-Origin' headers to every response to white listed URLs.
app.use(express.json()); // Use the JSON middleware, which allows the backend to read/parse data sent in the json formatted body of a request.
// Define the Port. Use 3001, as the React frontend uses 3000 by default.
const PORT = 3001;
// Define a 'GET' endpoint at the path '/api/ping'. In the frontend, constants.ts & App.tsx are hardcoded to look for this path.
app.get("/api/ping", (_req, res) => {
  console.log("someone pinged here"); // Log when a user (e.g. patientor-frontend), pings the server.
  res.send("pong"); // Send the string 'pong' back to the frontend with a 200 (OK) status code.
});
// Set the server to start listening for traffic on Port 3001.
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); // Log confirmation messages to the terminal on successful startup.
  console.log(`Test with: localhost:${PORT}/api/ping`);
});

/*
Cross-Origin Resource Sharing (CORS)
Default cors(): Uses * (wildcard), allowing access from any origin.
cors(WhiteList): Whitelists specific URLs. Significantly improving security by only allowing access to trusted URLs.
This enhanced security (appropriate for PROD), is not necessary in DEV. However, good practice early, is best practice.
*/
