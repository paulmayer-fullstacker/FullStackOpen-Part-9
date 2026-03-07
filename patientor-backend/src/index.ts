// src/index.ts

import express from "express";
import cors from "cors";
// Import routers for diagnoses and patients.
import diagnosisRouter from "./routes/diagnoses";
import patientRouter from "./routes/patients";
// Only allow requests from white listed URLs.
const corsWhiteList = [
  "http://localhost:3000", // Nolonger required having switched to Patienator frontend.
  "http://localhost:5173", // Required for frontend (Vite default port).
];

const app = express();
// use(cors()) Cross-Origin Resource Sharing: adds headers to the response that tell the browser that requests from a different URL/port are permitted.
app.use(
  cors({
    // Pass the corsWhiteList array as the 'origin' property of an options object.
    origin: corsWhiteList,
  }),
);
// Incoming requests with JSON data arrive as a raw stream of data. express.json() parses that stream and places the resulting object into 'req.body'.
app.use(express.json());

const PORT = 3001;
// ping/pong test to confimr the server is running and responding to requests.
// '_req' is required but unused. Underscore informes compiler to bypass 'unused variable' warnings.
app.get("/api/ping", (_req, res) => {
  res.send("pong");
});

// Register the router for the diagnoses endpoint. URL starting with /api/diagnoses is sliced, and the remainder passed into diagnosisRouter.
// Example: Request to /api/diagnoses/H54.7  goes to diagnosisRouter as a request to /H54.7 .
app.use("/api/diagnoses", diagnosisRouter);

// Register the router for the patients endpoint. Rrequest starting with /api/patients are sliced and handed to patientRouter
app.use("/api/patients", patientRouter);

app.listen(PORT, () => {
  console.log(`Server running on localhost:${PORT}`);
});

/*  Use with single whitelisted URL as string argument to cors():
const corsWhiteList = {
   origin: "http://localhost:3000", // Only allow requests from our frontend
};
app.use(cors(corsWhiteList));
*/
