// src/types.ts:
// Define the structure of our data. Copied from backend, to ensure consistency between front- and backend.
// Serving as the single source of truth, it ensures type safety across the entire frontend application, providing compile-time safety.

export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

// Enum for gender to restrict values to a specific set.
export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other"
}

// Enum for HealthCheck entries to enforce valid rating values (0-3).
// TypeScript allow mapping of numeric enums from key to value and value to key.
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
  type: "HealthCheck"; // Literal type acting as a discriminator for the union.
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

// Define Entry as a Discriminated Union of the three entry types. Thus, allowing a patient's 'entries' array to contain any of the three types.
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

export interface Patient {
  id: string;
  name: string;
  occupation: string;
  gender: Gender;
  ssn?: string;
  dateOfBirth?: string;
  entries: Entry[]; // Array containing any valid medical entry types.
}

// Helper type for the 'Add Patient' form, excluding fields the user doesn't provide.
export type PatientFormValues = Omit<Patient, "id" | "entries">;
