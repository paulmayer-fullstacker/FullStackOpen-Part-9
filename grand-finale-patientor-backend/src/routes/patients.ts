// src/routes/patients.ts:

import express, { Request, Response, NextFunction } from "express"; // Import express and TS type definitions. NextFunction: type for the next callback.
import patientService from "../services/patientService"; // Import the patientService business logic.
import toNewPatient, { toNewEntry } from "../utils"; // Import Zod validation logic. Used to sanitise the incoming data.
import { z } from "zod"; // Import z to handle Zod-specific errors.
import { NewPatient, Patient } from "../types"; // Import specific types.
// Express Router: A Router instance is a complete middleware and routing system (a mini-app).
const router = express.Router();
// Route Mapping: Since this router was mounted at '/api/patients' in index.ts, this '/' path refers to the base URL '/api/patients
router.get("/", (_req, res) => {
  // Use the NonSensitive version of the service function. Here we bridge the gap between the Request and the Service.
  // We call the service function (that already stripped out the SSNs), and send the resulting array as a JSON response.
  res.send(patientService.getNonSensitiveEntries());
});

router.get("/:id", (req, res) => {
  const patient = patientService.findById(req.params.id);
  if (patient) {
    res.json(patient);
  } else {
    res.sendStatus(404);
  }
});

// Route for adding a new entry to a specific patient.
router.post("/:id/entries", (req, res) => {
  try {
    const patient = patientService.findById(req.params.id);

    if (!patient) {
      return res.status(404).send({ error: "Patient not found" });
    }

    // Validate the entry data using Zod
    const newEntryData = toNewEntry(req.body);
    const addedEntry = patientService.addEntry(patient, newEntryData);

    return res.json(addedEntry);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return res.status(400).send({ error: error.issues });
    }
    return res.status(500).send({ error: "Internal server error" });
  }
});

// newPatientParser middleware to clean up the POST route; acting as a gatekeeper, before reaching the route logic.
const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    toNewPatient(req.body); // Validates and throws if invalid
    next(); // Moves to the next handler if valid
  } catch (error: unknown) {
    next(error); // Passes the Zod error to the errorMiddleware
  }
};

// This Error Middleware is a centralized place to catch all errors occurring in this router. Four arguments (error, req, res, next).
const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof z.ZodError) {
    // If Zod validation fails, send the 400 Bad Request immediately. ZodError contains an .issues array detailing which fields failed validation.
    res.status(400).send({ error: error.issues });
  } else {
    // If Zod validation passes, but some other error occurs, pass it to the global Express error handler
    next(error);
  }
};

// Define a POST route handler at the root path ('/') of this router. POST /api/patients. See 'app.use("/api/patients", patientRouter)' in index.ts.
router.post(
  "/",
  newPatientParser,
  (req: Request<unknown, unknown, NewPatient>, res: Response<Patient>) => {
    // At this point, we are guaranteed that req.body is a valid NewPatient.
    const addedPatient = patientService.addPatient(req.body);
    res.json(addedPatient);
  }
);

// Register the error middleware. Must be placed after the routes, to catch their errors.
router.use(errorMiddleware);

export default router;
