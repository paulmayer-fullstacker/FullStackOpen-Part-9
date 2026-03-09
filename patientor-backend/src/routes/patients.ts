// src/routes/patients.ts:

import express from "express";
import patientService from "../services/patientService";
import toNewPatient from "../utils";
// Express Router: A Router instance is a complete middleware and routing system (a mini-app).
const router = express.Router();
// Route Mapping: Since this router was mounted at '/api/patients' in index.ts, this '/' path refers to the base URL '/api/patients
router.get("/", (_req, res) => {
  // Use the NonSensitive version of the service function. Here we bridge the gap between the Request and the Service.
  // We call the service function (that already stripped out the SSNs), and send the resulting array as a JSON response.
  res.send(patientService.getNonSensitiveEntries());
});

// Define a POST route handler at the root path ('/') of this router. POST /api/patients. See 'app.use("/api/patients", patientRouter)' in index.ts.
router.post("/", (req, res) => {
  try {
    // Validate the body using the utility function. This returns a typed NewPatient object or throws an error.
    const newPatientEntry = toNewPatient(req.body);
    // Having validated newPatientEntry, pass it to the service layer which handles the 'database' interaction (adding an ID and pushing to the array).
    const addedPatient = patientService.addPatient(newPatientEntry);
    // send the newly created patient object back to the client as JSON. Thus confirming the operation was successful and providing the client with the new id.
    res.json(addedPatient);
  } catch (error: unknown) {
    // If toNewPatient or addPatient fails, initialize a generic error message.
    let errorMessage = "Something went wrong.";
    // Since 'error' is of type 'unknown', use instanceof Error to safely access the '.message' property with type-safety.
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    res.status(400).send(errorMessage); // Respond with 400 (Bad Request) status code to inform the client that their sent data did not pass validation.
  }
});

export default router;
