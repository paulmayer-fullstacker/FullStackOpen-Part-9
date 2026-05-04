// src/components/AddPatientModal/index.tsx:
// Wrapper component: acts as a structural container (modal/dialog window) for the AddPatientForm.

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  Alert
} from "@mui/material";

import AddPatientForm from "./AddPatientForm";
import { PatientFormValues } from "../../types";

// Define the structure of the props this component expects from its parent (PatientListPage).
interface Props {
  modalOpen: boolean; // Controls whether the modal is visible or hidden.
  onClose: () => void; // Function called when the user clicks outside the modal or hits cancel.
  onSubmit: (values: PatientFormValues) => void; // Function to handle the New Patient data submission.
  error?: string; // String to display backend validation errors (? opptional).
}

// AddPatientModal Component uses Material UI's Dialog to create an overlay on the screen.
const AddPatientModal = ({ modalOpen, onClose, onSubmit, error }: Props) => (
  // 'fullWidth' expands the modal to page size; 'open' determines visibility; 'onClose' handles backdrop clicks.
  <Dialog fullWidth={true} open={modalOpen} onClose={() => onClose()}>
    {/* Modal window header */}
    <DialogTitle>Add a new patient</DialogTitle>
    <Divider />
    {/* Modal main body */}
    <DialogContent>
      {/* Conditional Rendering: If 'error' exists, show the Material UI Alert box with the error message. */}
      {error && <Alert severity="error">{error}</Alert>}
      {/* The form component. Passing the 'onSubmit' and 'onClose' down to it. */}
      <AddPatientForm onSubmit={onSubmit} onCancel={onClose} />
    </DialogContent>
  </Dialog>
);

export default AddPatientModal;
