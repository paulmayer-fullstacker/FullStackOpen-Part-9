// src/components/SinglePatientPage/EntryComponent/OccupationalHealthComponent.tsx

import { Box, Typography } from "@mui/material";
import { Work } from "@mui/icons-material";
import { OccupationalHealthcareEntry, Diagnosis } from "../../../types";
import DiagnosisListHelper from "../DiagnosisListHelper";

interface Props {
  entry: OccupationalHealthcareEntry;
  diagnoses: Diagnosis[];
}

const OccupationalHealthComponent = ({ entry, diagnoses }: Props) => (
  <Box>
    <Typography variant="body1">
      {entry.date} <Work /> <strong>{entry.employerName}</strong>
    </Typography>
    <Typography variant="body2" sx={{ fontStyle: "italic" }}>
      {entry.description}
    </Typography>
    <DiagnosisListHelper codes={entry.diagnosisCodes} diagnoses={diagnoses} />
    {entry.sickLeave && (
      <Typography variant="body2">
        Sick leave: {entry.sickLeave.startDate} to {entry.sickLeave.endDate}
      </Typography>
    )}
    <Typography variant="body2">diagnose by {entry.specialist}</Typography>
  </Box>
);

export default OccupationalHealthComponent;
