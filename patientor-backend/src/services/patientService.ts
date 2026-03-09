// src/services/patientService.ts

import patientsData from "../../data/patients";
import { Patient, NonSensitivePatient, NewPatient } from "../types";
// npm install uuid , npm install --save-dev @types/uuid
import { v1 as uuid } from "uuid"; // Import uuid version 1 (timestamp-based) from 'uuid'.

// Data Casting: Our data/patients.ts is a standard JS array. By casting 'as Patient[]', we force TypeScript to treat the raw data
// as a collection of our Patient objects. This does not validate the data at runtime; it only helps during coding.
const patients: Patient[] = patientsData as Patient[];
// Returns the full unredacted list.
const getEntries = (): Patient[] => {
  return patients;
};

// Data Transformation (Redaction logic): Returning the data, stripped of ssn, as the TypeScript type 'NonSensitivePatient' prohibits 'ssn'.
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

const addPatient = (entry: NewPatient): Patient => {
  const newPatientEntry = {
    id: uuid(), // Generate a unique id string and add it to newPatientEntry.
    ...entry, // Spread the key-value pairs of the entry object. Add them to our newPatientEntry object.
  };
  patients.push(newPatientEntry); // Save the newPatient to the db emulation (patients array).
  return newPatientEntry; // Return the newly created Patient.
};

export default {
  // Export the Patient Service functions.
  getEntries,
  getNonSensitiveEntries,
  addPatient,
};
