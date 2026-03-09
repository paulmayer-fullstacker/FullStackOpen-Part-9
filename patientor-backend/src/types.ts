// src/types.ts

export interface Diagnosis {
  code: string;
  name: string;
  latin?: string; // The '?' denotes an optional property. Not all medical codes have a Latin name.
}

// Define the enum for patient gender.
export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

// Unredacted Patient type containing sensitive 'ssn' data.
export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string; // Restricted
  gender: Gender; // Use enum (M/F), here instead of string.
  occupation: string;
}

// Utility type: Omits 'ssn' from the Patient interface, thus ensuring we have a type-safe way to return data without sensitive fields.
export type NonSensitivePatient = Omit<Patient, "ssn">;
// Utility Type: Omit<T, K> A TypeScript 'Mapped Type'.  Takes the existing 'Patient' interface and creates a brand new type
// by removing the 'ssn' key.  Thus, preventing us from accidentally sending sensitive data (SSNs) to the client.

// To create a new patient we need a data type to hold the data coming in from the request.
// Since the server generates the patient id, the incoming object is a Patient minus the id field.
export type NewPatient = Omit<Patient, "id">;
