// src/components/PatientListPage/index.tsx:
// The primary table view for the application, showing the list of patients (name, gender, occupation, health rating).

import { useState } from "react";
import {
  Box,
  Table,
  Button,
  TableHead,
  Typography,
  TableCell,
  TableRow,
  TableBody
} from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link from react-router-dom to enable navigation to SinglePatient.

import { PatientFormValues, Patient } from "../../types";
import AddPatientModal from "../AddPatientModal";

import HealthRatingBar from "../HealthRatingBar";

import patientService from "../../services/patients";

interface Props {
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
}

const PatientListPage = ({ patients, setPatients }: Props) => {
  // Local state to manage the visibility of the 'Add Patient' modal.
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  // Local state to display validation errors to the user.
  const [error, setError] = useState<string>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };
  // Function to handle the logic for sending new patient data (not entry data), to the backend
  const submitNewPatient = async (values: PatientFormValues) => {
    try {
      // Send NewPatient form data to the backend (via the patientService). 'await' pauses execution until the server responds with the newly created patient (which will now include an 'id').
      const patient = await patientService.create(values);
      setPatients(patients.concat(patient)); // Update the local patient list state by appending the new patient (triggering rerender).
      setModalOpen(false); // Close the modal window upon successful creation.
    } catch (e: unknown) {
      // Error handling ifthe request fails:
      if (axios.isAxiosError(e)) {
        // if Axios error:
        if (e?.response?.data && typeof e?.response?.data === "string") {
          // if the backend sent a specific error message as a string, extracts the error message from the response.
          const message = e.response.data.replace(
            //
            "Something went wrong. Error: ",
            ""
          );
          console.error(message); // Log the message to the browser console (for Dev).
          setError(message); // Update the 'error' state, which displays an <Alert> component in the UI.
        } else {
          // Fallback for Axios errors that don't have a string error message.
          setError("Unrecognized axios error");
        }
      } else {
        // Finally, fallthrough for non-Axios (non-network) errors (e.g.: a code logic crash).
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };

  return (
    <div className="App">
      <Box>
        <Typography align="center" variant="h6">
          Patient list
        </Typography>
      </Box>
      <Table sx={{ marginBottom: "1em" }}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Occupation</TableCell>
            <TableCell>Health Rating</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Maps through the patients array to create table rows. */}
          {Object.values(patients).map((patient: Patient) => (
            <TableRow key={patient.id}>
              {/* Wrap the patient name in a Link component. The 'to' prop matches the route we defined in App.tsx: /patients/:id */}
              <TableCell>
                {/* Clicking the name redirects the user to the Single Patient view using their id. */}
                <Link to={`/patients/${patient.id}`}>{patient.name}</Link>
              </TableCell>
              <TableCell>{patient.gender}</TableCell>
              <TableCell>{patient.occupation}</TableCell>
              <TableCell>
                {/* By default the rating is currently hardcoded to '1' in the list view. showText=false - see HealthRatingBar for text options*/}
                <HealthRatingBar showText={false} rating={1} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Modal component containing the New Patient form. */}
      <AddPatientModal
        modalOpen={modalOpen}
        onSubmit={submitNewPatient}
        error={error}
        onClose={closeModal}
      />
      <Button variant="contained" onClick={() => openModal()}>
        Add New Patient
      </Button>
    </div>
  );
};

export default PatientListPage;
