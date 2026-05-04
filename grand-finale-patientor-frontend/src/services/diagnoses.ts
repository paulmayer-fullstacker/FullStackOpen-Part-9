// src/services/diagnoses.ts

import axios from "axios";
import { Diagnosis } from "../types";
import { apiBaseUrl } from "../constants";

// GET /api/diagnoses - Service to fetch diagnoses data from the backend. Diagnoses data consists of a diangosis aray.
const getDiagnosesData = async () => {
  const { data } = await axios.get<Diagnosis[]>(`${apiBaseUrl}/diagnoses`);

  return data;
};

export default {
  getDiagnosesData
};
