// src/routes/patients.ts:

import express from "express";
import patientService from "../services/patientService";
// Express Router: A Router instance is a complete middleware and routing system (a mini-app).
const router = express.Router();
// Route Mapping: Since this router was mounted at '/api/patients' in index.ts, this '/' path refers to the base URL '/api/patients
router.get("/", (_req, res) => {
  // Use the NonSensitive version of the service function. Here we bridge the gap between the Request and the Service.
  // We call the service function (that already stripped out the SSNs), and send the resulting array as a JSON response.
  res.send(patientService.getNonSensitiveEntries());
});

export default router;
