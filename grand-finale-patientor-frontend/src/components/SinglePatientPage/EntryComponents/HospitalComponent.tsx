// src/components/SinglePatientPage/EntryComponents/HospitalComponent.tsx

import { Box, Typography } from "@mui/material";
import { LocalHospital } from "@mui/icons-material";
import { HospitalEntry, Diagnosis } from "../../../types";
import DiagnosisListHelper from "../DiagnosisListHelper";

interface Props {
  entry: HospitalEntry;
  diagnoses: Diagnosis[];
}

const HospitalComponent = ({ entry, diagnoses }: Props) => (
  <Box>
    <Typography variant="body1">
      {entry.date} <LocalHospital />
    </Typography>
    <Typography variant="body2" sx={{ fontStyle: "italic" }}>
      {entry.description}
    </Typography>
    {/* Use our previously extracted DiagnosisList */}
    <DiagnosisListHelper codes={entry.diagnosisCodes} diagnoses={diagnoses} />
    <Typography variant="body2">
      Discharge: {entry.discharge.date} - {entry.discharge.criteria}
    </Typography>
    <Typography variant="body2">diagnose by {entry.specialist}</Typography>
  </Box>
);

export default HospitalComponent;
