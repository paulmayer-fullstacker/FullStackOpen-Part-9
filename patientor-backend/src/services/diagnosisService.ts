// src/services/diagnosisService.ts

import diagnosesData from "../../data/diagnoses"; // Import the raw array from the data folder.
import { Diagnosis } from "../types"; // Import the TypeScript interface/type for a Diagnosis.

// We use type assertion (as Diagnosis[]), since TS does not automatically know that the imported JSON/data matches our interface.
const diagnoses: Diagnosis[] = diagnosesData as Diagnosis[];
// Function to return all diagnosis entries.
const getEntries = (): Diagnosis[] => {
  return diagnoses;
};
// Export as an object {}, call it a tool box.  Allows us to add more tools to the box, later.
export default {
  getEntries,
};
