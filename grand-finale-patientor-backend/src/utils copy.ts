// src/utils.ts:
// Runtime Guard
import { NewPatient, Gender } from "./types";
// Type Predicate: 'text is string' tells TypeScript that if this returns true, the variable is guaranteed to be a string within that block.
const isString = (text: unknown): text is string => {
  // 'typeof' handles primitive string literals, while 'instanceof String' handles strings created with the 'new String()' constructor.
  return typeof text === "string" || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

// Validation of Gender: Confirm that the string is a member of the Gender enum.
const isGender = (param: string): param is Gender => {
  // Object.values(Gender) returns an array of the enum's values: ["male", "female", "other"]
  return (
    Object.values(Gender)
      // map the Enum values to strings to check if the incoming value matches one of the defined Gender values.
      .map((v) => v.toString())
      .includes(param)
  );
};
// Parser functions validate the unknown data. They either return the correct type or throw an error.
const parseGender = (gender: unknown): Gender => {
  if (!gender || !isString(gender) || !isGender(gender)) {
    throw new Error("Incorrect or missing gender: " + gender);
  }
  return gender;
};

const parseString = (text: unknown, fieldName: string): string => {
  if (!text || !isString(text)) {
    throw new Error(`Incorrect or missing ${fieldName}`);
  }
  return text;
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error("Incorrect or missing date: " + date);
  }
  return date;
};
// Define toNewPatient() function as a Type Guard for the POST /api/patients route. It transforms 'unknown' data into a 'NewPatient' type.
const toNewPatient = (object: unknown): NewPatient => {
  // Ensure 'object' is actually a non-null object.
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }
  // Presence Check: The 'in' operator performs "Type Narrowing". It proves to the compiler that these keys exist before we try to access them.
  if (
    "name" in object &&
    "dateOfBirth" in object &&
    "ssn" in object &&
    "gender" in object &&
    "occupation" in object
  ) {
    // Validation Parsing: Each field is individually passed through its specific parser.
    const newEntry: NewPatient = {
      name: parseString(object.name, "name"),
      dateOfBirth: parseDate(object.dateOfBirth),
      ssn: parseString(object.ssn, "ssn"),
      gender: parseGender(object.gender), // Ensure only members of the Gender enum (M/F), pass.
      occupation: parseString(object.occupation, "occupation"),
    };

    return newEntry;
  }

  throw new Error("Incorrect data: some fields are missing");
};

export default toNewPatient;
