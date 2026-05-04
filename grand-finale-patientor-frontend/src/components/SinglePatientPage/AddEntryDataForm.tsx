// src/components/SinglePatientPage/AddEntryDataForm.tsx
// Form component that switches its input fields based on the 'Entry Type' selected.

import { useState, SyntheticEvent } from "react";

import {
  TextField,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Alert
} from "@mui/material";

import {
  Entry,
  Diagnosis,
  HealthCheckRating,
  EntryWithoutId
} from "../../types";

interface Props {
  diagnoses: Diagnosis[];
  // Pass the submission logic back to the parent
  onSubmit: (values: EntryWithoutId) => Promise<void>;
  // Allow parent to signal a "Cancel" action
  onCancel: () => void;
  error?: string;
}

const AddEntryDataForm = ({ diagnoses, onSubmit, onCancel, error }: Props) => {
  // Entry Data Form State (common to all entries).
  const [type, setType] = useState<Entry["type"]>("HealthCheck");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);

  // Entry Type Specific State
  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(
    HealthCheckRating.Healthy
  );
  const [dischargeDate, setDischargeDate] = useState("");
  const [dischargeCriteria, setDischargeCriteria] = useState("");
  const [employerName, setEmployerName] = useState("");
  const [sickLeaveStart, setSickLeaveStart] = useState("");
  const [sickLeaveEnd, setSickLeaveEnd] = useState("");

  const submitEntry = (event: SyntheticEvent) => {
    event.preventDefault();

    // Construct the base object common to all entries
    const baseEntry = {
      description,
      date,
      specialist,
      diagnosisCodes
    };

    // Construct the specific entry type based on current selection
    let entryToSubmit: EntryWithoutId;

    // Construct the final object based on the current 'type' in state.
    switch (type) {
      case "HealthCheck":
        entryToSubmit = {
          ...baseEntry,
          type,
          healthCheckRating: Number(healthCheckRating)
        };
        break;
      case "Hospital":
        entryToSubmit = {
          ...baseEntry,
          type,
          discharge: { date: dischargeDate, criteria: dischargeCriteria }
        };
        break;
      case "OccupationalHealthcare":
        entryToSubmit = {
          ...baseEntry,
          type,
          employerName,
          sickLeave:
            sickLeaveStart && sickLeaveEnd // Only include sickLeave if both dates are provided.
              ? { startDate: sickLeaveStart, endDate: sickLeaveEnd }
              : undefined
        };
        break;
      default:
        return;
    }

    void onSubmit(entryToSubmit);
  };

  return (
    <Box
      sx={{ border: "2px dashed #ccc", p: 2, mt: 3, mb: 3, borderRadius: 1 }}
    >
      <Typography variant="h6">New Entry</Typography>

      {/* Show error alerts passed down from the parent's API call */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={submitEntry}>
        {/* Entry Type Selector: Changes which fields are visible below */}
        <Typography variant="body2">Entry Type</Typography>
        <Select
          value={type}
          fullWidth
          onChange={({ target }) => setType(target.value as Entry["type"])}
          sx={{ mb: 2 }}
        >
          <MenuItem value="HealthCheck">Health Check</MenuItem>
          <MenuItem value="Hospital">Hospital</MenuItem>
          <MenuItem value="OccupationalHealthcare">
            Occupational Healthcare
          </MenuItem>
        </Select>

        {/* Base object common fieds */}
        <TextField
          label="Description"
          fullWidth
          value={description}
          onChange={({ target }) => setDescription(target.value)}
          sx={{ mb: 1 }}
        />
        <TextField
          label="Date"
          type="date"
          fullWidth
          value={date}
          onChange={({ target }) => setDate(target.value)}
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }} // Forces label to stay above the date picker
        />
        <TextField
          label="Specialist"
          fullWidth
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
          sx={{ mb: 1 }}
        />

        {/* Diagnosis Codes Multi-Selector with Checkboxes */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Diagnosis codes</InputLabel>
          <Select
            multiple
            value={diagnosisCodes}
            onChange={({ target }) =>
              setDiagnosisCodes(
                typeof target.value === "string"
                  ? target.value.split(",")
                  : target.value
              )
            }
            input={<OutlinedInput label="Diagnosis codes" />}
            // renderValue now returns a comma-separated string instead of Chips
            renderValue={(selected) => selected.join(", ")}
          >
            {diagnoses.map((d) => (
              <MenuItem key={d.code} value={d.code}>
                {/* Added Checkbox to show the selection state visually */}
                <Checkbox checked={diagnosisCodes.indexOf(d.code) > -1} />
                {/* ListItemText displays the primary label (the code) */}
                <ListItemText primary={`${d.code} ${d.name}`} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Conditional Rendering of Fields Based on Etry Type */}
        {type === "HealthCheck" && (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Healthcheck rating</InputLabel>
            <Select
              value={healthCheckRating}
              label="Healthcheck rating"
              onChange={({ target }) =>
                setHealthCheckRating(Number(target.value))
              }
            >
              <MenuItem value={HealthCheckRating.Healthy}>Healthy (0)</MenuItem>
              <MenuItem value={HealthCheckRating.LowRisk}>
                Low Risk (1)
              </MenuItem>
              <MenuItem value={HealthCheckRating.HighRisk}>
                High Risk (2)
              </MenuItem>
              <MenuItem value={HealthCheckRating.CriticalRisk}>
                Critical Risk (3)
              </MenuItem>
            </Select>
          </FormControl>
        )}

        {type === "Hospital" && (
          <Box sx={{ mb: 2, p: 2, bgcolor: "#f9f9f9", borderRadius: 1 }}>
            <Typography variant="subtitle2">Discharge</Typography>
            <TextField
              label="Date"
              type="date"
              fullWidth
              value={dischargeDate}
              onChange={({ target }) => setDischargeDate(target.value)}
              sx={{ mt: 1, mb: 1 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Criteria"
              fullWidth
              value={dischargeCriteria}
              onChange={({ target }) => setDischargeCriteria(target.value)}
            />
          </Box>
        )}

        {type === "OccupationalHealthcare" && (
          <Box sx={{ mb: 2, p: 2, bgcolor: "#f9f9f9", borderRadius: 1 }}>
            <TextField
              label="Employer Name"
              fullWidth
              value={employerName}
              onChange={({ target }) => setEmployerName(target.value)}
              sx={{ mb: 2 }}
            />
            <Typography variant="subtitle2">Sick Leave</Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              <TextField
                label="Start Date"
                type="date"
                fullWidth
                value={sickLeaveStart}
                onChange={({ target }) => setSickLeaveStart(target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="End Date"
                type="date"
                fullWidth
                value={sickLeaveEnd}
                onChange={({ target }) => setSickLeaveEnd(target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Box>
        )}

        {/* Form Action Buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            color="error"
            variant="contained"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button color="primary" variant="contained" type="submit">
            Add
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddEntryDataForm;
