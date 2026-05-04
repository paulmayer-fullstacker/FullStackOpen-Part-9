// src/routes/diagnoses.ts

import express from "express";
import diagnosisService from "../services/diagnosisService";
// Create a new Router instance to define specific routes for the /api/diagnoses path.
const router = express.Router();

// Handles GET requests to /api/diagnoses
// Defines a listener for HTTP GET requests. Path: "/" (relative to where this router is mounted in index.ts), is actually /api/diagnoses.
// _req: is required but unused. Underscore silences 'unused variable' warnings. res: 'response' object used to send data back to the client.
router.get("/", (_req, res) => {
  // Call the service function and send the result as a JSON response.
  res.send(diagnosisService.getEntries());
});
// Export the router for use in the main app file (index.ts)
export default router;
