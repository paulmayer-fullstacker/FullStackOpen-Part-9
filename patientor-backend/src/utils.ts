import { z } from "zod"; // npm install zod. Then import zod
import { Gender } from "./types"; // NewPatient import removed to prevent circular dependency, as types.ts now imports from here.

// Define the Zod schema to replace manual validation logic for Patients
export const NewPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().date(), // Validates ISO date strings (YYYY-MM-DD). Warning: .data() depricated in Zod v4.
  ssn: z.string(),
  gender: z.nativeEnum(Gender), // Automatically validates against your Gender enum.  Warning: .nativeEnum() depricated in Zod v4.
  occupation: z.string(),
});

// toNewPatient validates 'unknown' data and transforms it to the verified NewPatient type.
const toNewPatient = (object: unknown) => {
  // .parse() will validate the object against the schema, throwing an error if it fails.
  return NewPatientSchema.parse(object);
};

// All previous helper functions (isString, isDate, isGender, parseGender, etc.) removed, as Zod handles these internally.

export default toNewPatient;
