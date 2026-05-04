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

// // Define array of patient entries for Ex-9.21:
// // eslint-disable-next-line @typescript-eslint/no-empty-object-type
// export interface Entry {}

// Enum for HealthCheck entries to enforce valid rating values (0-3).
export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3
}

// Base interface for properties common to all entry types.
interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  // Use Diagnosis['code'] to ensure codes match the Diagnosis interface.
  diagnosisCodes?: Array<Diagnosis["code"]>;
}

// HealthCheckEntry interface adding fields specific to type for health checks, to the (standard) BaseEntryfields.
export interface HealthCheckEntry extends BaseEntry {
  type: "HealthCheck"; // Discriminant field
  healthCheckRating: HealthCheckRating;
}

// HospitalEntry interface adding field specific to hospital visits (i.e., discharge data).
export interface HospitalEntry extends BaseEntry {
  type: "Hospital"; // Discriminant field
  discharge: {
    date: string;
    criteria: string;
  };
}

// OccupationalHealthcareEntry interface with field specific to occupational health (inc. employer name and sick leave).
export interface OccupationalHealthcareEntry extends BaseEntry {
  type: "OccupationalHealthcare"; // Discriminant field
  employerName: string;
  sickLeave?: {
    startDate: string;
    endDate: string;
  };
}

// Define Entry as a Union of the three entry types. Thus, allowing a patient's 'entries' array to contain any of the three types.
export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;

// Entry type is a discriminated union. So, Omit will not work directly Define UnionOmit to maintain the discriminator.
type UnionOmit<T, K extends string | number | symbol> = T extends unknown
  ? Omit<T, K>
  : never;

// Use UnionOmit to define an EntryWithoutId property for POST requests. The backend will generate and issue an Id to the newly posted entry.
export type EntryWithoutId = UnionOmit<Entry, "id">;

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
