// src/App.tsx:
// The root component of the application, manages global state (patients/diagnoses), and sets up client-side routing.

import { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom"; // React Router components for navigating between the list and single patient views.
import { Button, Divider, Container, Typography } from "@mui/material";

import { apiBaseUrl } from "./constants";
import { Patient, Diagnosis } from "./types";

import patientService from "./services/patients";
import diagnosisService from "./services/diagnoses";

import PatientListPage from "./components/PatientListPage";
import SinglePatientPage from "./components/SinglePatientPage"; // Import SinglePatientPage component

const App = () => {
  const [patients, setPatients] = useState<Patient[]>([]); // State to hold the list of patients (fetched from backend).

  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]); // State to hold the list of all diagnosee

  useEffect(() => {
    // Basic connectivity check to the backend.
    void axios.get<void>(`${apiBaseUrl}/ping`);
    // Fetche all patients list from backend, and update the 'patients' state.
    const fetchPatientList = async () => {
      const patients = await patientService.getAll();
      setPatients(patients);
    };

    // Fetches all diagnoses list (codes/descriptions) from the backend.
    const fetchDiagnosisList = async () => {
      const diagnoses = await diagnosisService.getDiagnosesData();
      setDiagnoses(diagnoses);
    };
    // Execute fetches for patinet and diagnoses lists once, at startup.
    void fetchPatientList();
    void fetchDiagnosisList();
  }, []);

  return (
    <div className="App">
      <Router>
        <Container>
          <Typography variant="h3" sx={{ marginBottom: "0.5em" }}>
            Patientor
          </Typography>
          {/* Global 'Home' button: resets the view to the Patient List. */}
          <Button component={Link} to="/" variant="contained" color="primary">
            Home
          </Button>
          <Divider sx={{ marginY: 2 }} />
          <Routes>
            {/* Main view: Displays the table of all patients. */}
            <Route
              path="/"
              element={
                <PatientListPage
                  patients={patients}
                  setPatients={setPatients}
                />
              }
            />
            {/* Detail view (Single Patient Route): Use ':id' to identify which patient to show. */}
            <Route
              path="/patients/:id"
              element={<SinglePatientPage diagnoses={diagnoses} />}
            />
          </Routes>
        </Container>
      </Router>
    </div>
  );
};

export default App;
