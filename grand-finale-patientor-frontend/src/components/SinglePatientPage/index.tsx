// src/components/SinglePatientPage/index.tsx
// Controller for the patients detaild medical history page. It displays all details for a specific patient, inc. ssn, gender icon, list of medical entries.

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// import axios from "axios";  // Removed to utils.parseErrorMessage

import { Typography, Box, Paper } from "@mui/material";

import { Female, Male, Transgender } from "@mui/icons-material";

import { Patient, Gender, Entry, Diagnosis, EntryWithoutId } from "../../types";

import patientService from "../../services/patients";

import HospitalComponent from "./EntryComponents/HospitalComponent"; // Import individual health care entry components.
import OccupationalHealthComponent from "./EntryComponents/OccupationalHealthComponent";
import HealthCheckComponent from "./EntryComponents/HealthCheckComponent";

import AddEntryDataForm from "./AddEntryDataForm";

import { EntryWithoutIdSchema } from "../../schemas";
import { parseErrorMessage } from "../../utils";

// Function for type checking. If a new entry type is added to the Union but not handled in a switch, TS will throw an error here.
const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

interface Props {
  diagnoses: Diagnosis[];
}

// Helper component to render the correct MUI icon based on gender. Moved outside main component to prevent unnecessary re-creations on render.
const GenderIcon = ({ gender }: { gender: Gender }) => {
  switch (gender) {
    case Gender.Male:
      return <Male />;
    case Gender.Female:
      return <Female />;
    default:
      return <Transgender />;
  }
};

// Sub-router component that selects the correct UI component based on the 'type' field of the medical entry.
const EntryDetails: React.FC<{ entry: Entry; diagnoses: Diagnosis[] }> = ({
  entry,
  diagnoses
}) => {
  switch (entry.type) {
    case "Hospital":
      return <HospitalComponent entry={entry} diagnoses={diagnoses} />;
    case "OccupationalHealthcare":
      return (
        <OccupationalHealthComponent entry={entry} diagnoses={diagnoses} />
      );
    case "HealthCheck":
      return <HealthCheckComponent entry={entry} diagnoses={diagnoses} />;
    default:
      return assertNever(entry); // Ensure all types are handled correctly.
  }
};

const SinglePatientPage = ({ diagnoses }: Props) => {
  const { id } = useParams<{ id: string }>(); // Retrieve the 'id' parameter from the URL (e.g., /patients/d27711ed...).
  const [patient, setPatient] = useState<Patient>();
  const [error, setError] = useState<string>();
  const [showForm, setShowForm] = useState(false); // State to toggle New Entry form visibility.

  useEffect(() => {
    const fetchPatient = async () => {
      if (id) {
        // if id is valid, fetch the full patient object (including SSN and entries) from the backend
        const patientData = await patientService.getSinglePatientById(id);
        setPatient(patientData);
      }
    };
    void fetchPatient();
  }, [id]); // Re-run fetchPatient if the ID in the URL changes.

  // Logic to handle form submission (submit a new medical entry to the backend).
  const submitNewEntry = async (values: EntryWithoutId) => {
    if (!id || !patient) return;

    try {
      // Client-side validation: Validate on the frontend against our Zod schema, to throw a ZodError if inputs are incorrect.
      const validatedEntry = EntryWithoutIdSchema.parse(values);

      // Now send the validated data and persist the entry in the backend.
      const addedEntry = await patientService.addEntry(id, validatedEntry);

      // UI Update: Update the local state to include the new entry without a full page refresh.
      setPatient({
        ...patient,
        entries: patient.entries.concat(addedEntry)
      });
      setShowForm(false);
      setError(undefined);
    } catch (e: unknown) {
      // Use util.parseErrorMessage to extract the error message. Replacing the hard coded message, below.
      const msg = parseErrorMessage(e);
      setError(msg);
    }
  };

  //   try {
  //     const addedEntry = await patientService.addEntry(id, values);
  //     setPatient({
  //       ...patient,
  //       entries: patient.entries.concat(addedEntry)
  //     });
  //     setShowForm(false); // Close form on success
  //     setError(undefined);
  //   } catch (e: unknown) {
  //     if (axios.isAxiosError(e)) {
  //       // Simple error extraction (We can refine this with the utility later)
  //       const msg = e.response?.data?.error || e.message;
  //       setError(
  //         Array.isArray(msg)
  //           ? "Validation failed. Please check your inputs."
  //           : String(msg)
  //       );
  //     } else {
  //       setError("An unexpected error occurred");
  //     }
  //   }
  // };

  if (!patient) return null; // Wait until patient data is loaded

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
        {patient.name} <GenderIcon gender={patient.gender} />
      </Typography>

      <Typography sx={{ mt: 1 }}>ssn: {patient.ssn}</Typography>
      <Typography sx={{ mb: 2 }}>occupation: {patient.occupation}</Typography>

      {/* Conditional rendering, renders either the entry form or the 'Add New Patient Entry' button. */}
      {showForm ? (
        <AddEntryDataForm
          diagnoses={diagnoses}
          onSubmit={submitNewEntry}
          onCancel={() => setShowForm(false)}
          error={error}
        />
      ) : (
        <Paper
          sx={{
            p: 1,
            mb: 2,
            textAlign: "center",
            cursor: "pointer",
            bgcolor: "#f0f0f0"
          }}
          onClick={() => setShowForm(true)}
        >
          <Typography variant="button">+ Add New Patient Entry</Typography>
        </Paper>
      )}

      <Typography variant="h6" sx={{ mt: 3, mb: 1, fontWeight: "bold" }}>
        entries
      </Typography>
      {/* Map through all entries to render them inside styled Paper components */}
      {patient.entries.map((entry) => (
        <Paper
          variant="outlined"
          key={entry.id}
          sx={{ p: 2, mb: 2, borderRadius: 2 }}
        >
          <EntryDetails entry={entry} diagnoses={diagnoses} />
        </Paper>
      ))}
    </Box>
  );
};

export default SinglePatientPage;
