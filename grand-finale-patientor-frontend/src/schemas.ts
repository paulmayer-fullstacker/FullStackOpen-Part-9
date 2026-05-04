// src/schemas.ts:
// Defines rules for validating input data,before it is sent to the backend.
// Uses the Zod library to define runtime validation schemas, that will validate input data at runtime.

import { z } from "zod";
import { Gender, HealthCheckRating } from "./types";

// Schema for validating the New Patient form data.
export const NewPatientSchema = z.object({
  name: z.string().min(1, "Name is required."),
  dateOfBirth: z.string().date("Invalid date format. Use the date picker."), // .date(): ensure the string follows YYYY-MM-DD format.
  ssn: z.string().min(1, "SSN is required."),
  gender: z.nativeEnum(Gender), // Ensure the value is one of the keys in the Gender enum.
  occupation: z.string().min(1, "Occupation is required.")
});

// Schema to validate shared fields, used by all Entry schemas (avoiding repetition).
const BaseEntrySchema = z.object({
  description: z.string().min(1, "Description is required."),
  date: z.string().date("Invalid date format. Use the date picker."),
  specialist: z.string().min(1, "Specialist name is required."),
  diagnosisCodes: z.array(z.string()).optional()
});

// Schema to validate HealthCheck specific entries.
export const HealthCheckEntrySchema = BaseEntrySchema.extend({
  type: z.literal("HealthCheck"),
  healthCheckRating: z
    .nativeEnum(HealthCheckRating)
    // Use .refine() to ensure the numeric value for ealthCheckRating is valid.
    .refine((val) => Object.values(HealthCheckRating).includes(val), {
      message:
        "Health Check Rating should fall between '0' (Healthy) and '3' (Criticaly Ill)."
    })
});

// Schema to validate Hospital entries.
export const HospitalEntrySchema = BaseEntrySchema.extend({
  type: z.literal("Hospital"),
  discharge: z.object({
    date: z.string().date("Discharge date is required."),
    criteria: z.string().min(1, "Discharge criteria is required.")
  })
});
// Schema for Occupational healthcare entries.
export const OccupationalHealthcareEntrySchema = BaseEntrySchema.extend({
  type: z.literal("OccupationalHealthcare"),
  employerName: z.string().min(1, "Employer name is required."),
  sickLeave: z
    .object({
      startDate: z.string().date("Invalid start date. Use the date picker."),
      endDate: z.string().date("Invalid end date. Use the date picker.")
    })
    .optional()
});

// Uses z.discriminatedUnion to validate the 'type' field first, then apply the schema for that selected type.
export const EntryWithoutIdSchema = z.discriminatedUnion("type", [
  HealthCheckEntrySchema,
  HospitalEntrySchema,
  OccupationalHealthcareEntrySchema
]);
