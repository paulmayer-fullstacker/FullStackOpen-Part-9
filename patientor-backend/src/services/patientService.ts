// src/services/patientService.ts

import patientsData from "../../data/patients";
import { Patient, NonSensitivePatient } from "../types";

// Data Casting: Our data/patients.ts is a standard JS array. By casting 'as Patient[]', we force TypeScript to treat the raw data
// as a collection of our Patient objects. This does not validate the data at runtime; it only helps during coding.
const patients: Patient[] = patientsData as Patient[];
// Returns the full unredacted list.
const getEntries = (): Patient[] => {
  return patients;
};

// Data Transformation (Redaction logic): Returning the data, stripped of ssn , as the TypeScript type 'NonSensitivePatient' prohibits 'ssn'.
// Variable 'patients' has SSNs. So, manually strip them out, because TypeScript types vanish after the code is compiled to JavaScript.
const getNonSensitiveEntries = (): NonSensitivePatient[] => {
  // Use object destructuring inside the map function, to explicitly pick out the fields we wantT to keep, discarding ssn.
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

export default {
  getEntries,
  getNonSensitiveEntries,
};
