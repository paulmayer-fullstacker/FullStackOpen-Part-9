// src/utils.ts:

import { z } from "zod"; // npm install zod. Then import zod
import { Gender, HealthCheckRating } from "./types"; // NewPatient import removed to prevent circular dependency, as types.ts now imports from here.

// Define the Zod schema to replace manual validation logic for Patients
export const NewPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().date(), // Validates ISO date strings (YYYY-MM-DD). Warning: .data() depricated in Zod v4.
  ssn: z.string(),
  gender: z.nativeEnum(Gender), // Automatically validates against your Gender enum.  Warning: .nativeEnum() depricated in Zod v4.
  occupation: z.string()
});

// Define schemas for each Entry type to validate required fields
const BaseEntrySchema = z.object({
  description: z.string().min(1),
  date: z.string().date(),
  specialist: z.string().min(1),
  diagnosisCodes: z.array(z.string()).optional()
});

const HealthCheckEntrySchema = BaseEntrySchema.extend({
  type: z.literal("HealthCheck"),
  healthCheckRating: z.nativeEnum(HealthCheckRating)
});

const HospitalEntrySchema = BaseEntrySchema.extend({
  type: z.literal("Hospital"),
  discharge: z.object({
    date: z.string().date(),
    criteria: z.string().min(1)
  })
});

const OccupationalHealthcareEntrySchema = BaseEntrySchema.extend({
  type: z.literal("OccupationalHealthcare"),
  employerName: z.string().min(1),
  sickLeave: z
    .object({
      startDate: z.string().date(),
      endDate: z.string().date()
    })
    .optional()
});

// HIGHLIGHT: The final Entry schema using a discriminated union
export const EntryWithoutIdSchema = z.discriminatedUnion("type", [
  HealthCheckEntrySchema,
  HospitalEntrySchema,
  OccupationalHealthcareEntrySchema
]);

// toNewPatient validates 'unknown' data and transforms it to the verified NewPatient type.
const toNewPatient = (object: unknown) => {
  // .parse() will validate the object against the schema, throwing an error if it fails.
  return NewPatientSchema.parse(object);
};

// Parser for incoming Entry data.
export const toNewEntry = (object: unknown) => {
  return EntryWithoutIdSchema.parse(object);
};

export default toNewPatient;
