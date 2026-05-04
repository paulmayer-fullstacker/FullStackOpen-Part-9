// src/components/SinglePatientPage/DiagnosisList.tsx
// Helper app to render the list of entry diagnosis codes and their names (English descriptions).
import { List, ListItem, ListItemText } from "@mui/material";
import { Diagnosis } from "../../types";

interface Props {
  // Accept the codes from the entry and the full list of diagnoses from App state
  codes?: Array<Diagnosis["code"]>;
  diagnoses: Diagnosis[];
}

const DiagnosisListHelper = ({ codes, diagnoses }: Props) => {
  // If there are no codes, we render nothing.
  if (!codes || codes.length === 0) {
    return null;
  }

  return (
    <List sx={{ listStyleType: "disc", pl: 4 }}>
      {codes.map((code) => {
        // Map through the codes to find the full diagnosis object, to get the name
        const diagnosis = diagnoses.find((d) => d.code === code);
        return (
          <ListItem key={code} sx={{ display: "list-item", p: 0 }}>
            <ListItemText
              // Display the code and the name (if found)
              primary={`${code} ${diagnosis ? diagnosis.name : ""}`}
            />
          </ListItem>
        );
      })}
    </List>
  );
};

export default DiagnosisListHelper;
