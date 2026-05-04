// src/types.ts:

import { z } from "zod";
import { NewPatientSchema } from "./utils";

export interface Diagnosis {
  code: string;
  name: string;
  latin?: string; // The '?' denotes an optional property. Not all medical codes have a Latin name.
}

// Define the enum for patient gender.
export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other"
}

// Define array of patient entries for Ex-9.21:
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Entry {}

// Unredacted Patient type containing sensitive 'ssn' data.
export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string; // Restricted
  gender: Gender; // Use enum (M/F), here instead of string.
  occupation: string;
  entries: Entry[]; // entries field added for Ex-9.21. Also restricted data.
}

// Utility type: Omits 'ssn' and 'entries' from the Patient interface, thus ensuring we have a type-safe way to return data without sensitive fields.
export type NonSensitivePatient = Omit<Patient, "ssn" | "entries">;
// Utility Type: Omit<T, K> A TypeScript 'Mapped Type'.  Takes the existing 'Patient' interface and creates a brand new type
// by removing the 'ssn' and 'entries' key.  Thus, preventing us from accidentally sending sensitive data (SSNs) to the client.

// To create a new patient we need a data type to hold the data coming in from the request.
// Since the server generates the patient id, the incoming object is a Patient minus the id field.
// Instead of manual Omit, infer the type from our Zod Schema. Thus, ensuring that if we modify fields in the Zod schema, this type updates automatically.
export type NewPatient = z.infer<typeof NewPatientSchema>;
