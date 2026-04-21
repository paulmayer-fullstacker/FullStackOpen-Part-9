// src/types.ts

// This file defines a 'contract' between the front and back ends.

// Define fixed sets of allowed strings (Enums) for weather and visibility.
// They must be exactly as specified in the backend (see backend/src/types.ts), as the backend validates these string values.
export enum Weather {
  Sunny = "sunny",
  Rainy = "rainy",
  Cloudy = "cloudy",
  Stormy = "stormy",
  Windy = "windy"
}

export enum Visibility {
  Great = "great",
  Good = "good",
  Ok = "ok",
  Poor = "poor"
}
// Interface defining the structure of an existing diary entry. The full structure as it comes from the API
export interface DiaryEntry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment: string;
}

// Create a type for diary entry, that excludes the 'id' field. The backend generates the ID automatically.
// Use Omit to create a Diary Entry type without an Id.
export type NewDiaryEntry = Omit<DiaryEntry, "id">;
