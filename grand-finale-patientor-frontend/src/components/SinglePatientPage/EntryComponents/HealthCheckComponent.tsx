// src/components/SinglePatientPage/EntryComponent/HealthCheckComponent.tsx

import { Box, Typography } from "@mui/material";
import { MedicalServices, Favorite } from "@mui/icons-material";
import { HealthCheckEntry, Diagnosis, HealthCheckRating } from "../../../types";
import DiagnosisListHelper from "../DiagnosisListHelper";

interface Props {
  entry: HealthCheckEntry;
  diagnoses: Diagnosis[];
}

const HealthCheckComponent = ({ entry, diagnoses }: Props) => {
  // Helper for heart icon color
  const getHeartColor = (rating: HealthCheckRating) => {
    switch (rating) {
      case HealthCheckRating.Healthy:
        return "green";
      case HealthCheckRating.LowRisk:
        return "yellow";
      case HealthCheckRating.HighRisk:
        return "orange";
      case HealthCheckRating.CriticalRisk:
        return "red";
      default:
        return "grey";
    }
  };

  return (
    <Box>
      <Typography variant="body1">
        {entry.date} <MedicalServices />
      </Typography>
      <Typography variant="body2" sx={{ fontStyle: "italic" }}>
        {entry.description}
      </Typography>
      <Favorite sx={{ color: getHeartColor(entry.healthCheckRating) }} />
      <DiagnosisListHelper codes={entry.diagnosisCodes} diagnoses={diagnoses} />
      <Typography variant="body2">diagnose by {entry.specialist}</Typography>
    </Box>
  );
};

export default HealthCheckComponent;
