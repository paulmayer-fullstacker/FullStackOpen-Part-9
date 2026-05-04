// src/services/patients.ts:
// Logic for making HTTP requests regarding Patient data.

import axios from "axios";
import { Patient, PatientFormValues, Entry, EntryWithoutId } from "../types";

import { apiBaseUrl } from "../constants";

// GET /api/patients - Returns an array of all patients (excluding ssn).
const getAll = async () => {
  const { data } = await axios.get<Patient[]>(`${apiBaseUrl}/patients`);

  return data;
};

// GET /api/patients/id - Returns full details for one patient (inc. ssn and entries).
const getSinglePatientById = async (id: string) => {
  const { data } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
  return data;
};

// POST /api/patients - Create a new patient record.
const create = async (object: PatientFormValues) => {
  const { data } = await axios.post<Patient>(`${apiBaseUrl}/patients`, object);

  return data;
};

// POST /api/patients/id/entries - Adds new medical entry to the patient identified by id.
const addEntry = async (id: string, object: EntryWithoutId): Promise<Entry> => {
  const { data } = await axios.post<Entry>(
    `${apiBaseUrl}/patients/${id}/entries`,
    object
  );
  return data;
};

export default {
  getAll,
  getSinglePatientById,
  create,
  addEntry
};
