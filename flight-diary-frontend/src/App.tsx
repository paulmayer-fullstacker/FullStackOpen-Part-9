// src/App.tsx:

import { useEffect, useState } from "react";
import axios from "axios";

// Importing our custom TypeScript definitions (types and enums), to ensure data consistency.
import {
  type DiaryEntry,
  type NewDiaryEntry,
  Weather,
  Visibility
} from "./types";

const App = () => {
  // State for the list of diaries (initialy empty).
  // <DiaryEntry[]> tells TypeScript the list will only contain objects of type DiaryEntry. ([]) sets state to initialy empty.
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  // State for the form inputs:
  // 'date' is a string, whose is state tied to the HTML date picker. Initial state empty "".
  const [date, setDate] = useState("");
  // 'visibility' and 'weather' use Enums from our types file. Set defaults (Weather.Sunny) so the form isn't empty on load.
  const [visibility, setVisibility] = useState<Visibility>(Visibility.Great);
  const [weather, setWeather] = useState<Weather>(Weather.Sunny);
  // 'comment' tracks the text the user types into the comment input field. Initialy empty "", though input field will have a placeholder.
  const [comment, setComment] = useState("");
  // 'error' stores any error messages from the server. Initially null, because there are no errors when the app first loads.
  const [error, setError] = useState<string | null>(null);

  // useEffect runs after the component is rendered. Thus, we fetch diaries on component mount.
  useEffect(() => {
    // Make a GET request to the backend API to fetch existing entries.
    axios
      .get<DiaryEntry[]>("http://localhost:3000/api/diaries")
      .then((response) => {
        // Once the data arrives, save it to our 'diaries' state.
        setDiaries(response.data);
      })
      .catch((err) => {
        // If the server is down or URL is incorrect, log it to the console.
        console.error("Failed to fetch diaries", err);
      });
  }, []); // The empty dependency array [] ensures it only runs once (on mount).

  const diaryCreation = async (event: React.SyntheticEvent) => {
    // 'async' allows us to use 'await' for the Axios post request.
    event.preventDefault(); // Prevents the browser from reloading the page when the form is submitted.
    // Construct the object to be sent to the server. Matching the NewDiaryEntry type, but without the 'id' attribute.
    const entryToAdd: NewDiaryEntry = {
      date,
      weather,
      visibility,
      comment
    };

    try {
      // Send POST request with entryToAdd to backend. Await response.
      const response = await axios.post<DiaryEntry>(
        "http://localhost:3000/api/diaries",
        entryToAdd
      );
      // On success, update the UI by adding the server's version of the entry (now includes an ID), to our existing diaries array.
      setDiaries(diaries.concat(response.data));
      // Reset the form fields to clear the UI for the next entry.
      setDate("");
      setComment("");
      setError(null); // Clear any previous error messages. Though error messages will clear after timeout.
    } catch (err) {
      // This block runs if the server returns an error (i.e., 400 Bad Request).
      if (axios.isAxiosError(err) && err.response) {
        // Display the error message sent by the backend (e.g., "Incorrect weather")
        setError(String(err.response.data));
      } else {
        setError("An unknown error occurred");
      }
      setTimeout(() => setError(null), 5000); // After 5 seconds, clear the error state to hide the error message.
    }
  };
  // UI Rendering
  return (
    <div style={{ padding: "20px" }}>
      <h2>Add new entry</h2>

      {/* Conditional Rendering: Only show this <p> if 'error' is not null. */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={diaryCreation}>
        <div>
          date{" "}
          <input
            type="date"
            value={date} // date is a 'controlled' input, whoes value comes from React state.
            onChange={(e) => setDate(e.target.value)} // Update state on change.
          />
        </div>

        {/* Use radio buttons to ensure valid Enum values are sent. Safer than freehand user input */}
        <div>
          visibility:
          {/* Object.values(Visibility) creates an array of strings from the Visibility enumme: ['great', 'good', ok, poor] */}
          {Object.values(Visibility).map(
            (
              v // The array is mapped through to create a radio button for each enume value.
            ) => (
              <label key={v}>
                <input
                  type="radio"
                  name="visibility" // Each button shares the same name, forming a group. Grouping radio buttons so only one can be picked.
                  onChange={() => setVisibility(v)} // Update state to the selected enum value.
                  checked={visibility === v} // Radio btton is 'checked' if state (visibility) matches the current value of 'v'.
                />{" "}
                {/* Explicitly place a space between the radio button and its label {v}. */}
                {v}
              </label>
            )
          )}
        </div>

        <div>
          weather:
          {/* Create dynamically generating radio buttons for every possible weather enum. As per 'visibility'.*/}
          {Object.values(Weather).map((w) => (
            <label key={w}>
              <input
                type="radio"
                name="weather"
                onChange={() => setWeather(w)}
                checked={weather === w}
              />{" "}
              {w}
            </label>
          ))}
        </div>

        <div>
          comment {/* Render 'comment' and a space. */}
          <input
            value={comment} // Binds the input's content to the comment state variable. If state is empty, the box is empty.
            onChange={(e) => setComment(e.target.value)} // Event listener. Each time key is pressed, event 'e' is captured and state is updated.
            placeholder="Write your comments here..." // Show ghost text in box to prompt user. This is not input text.
          />
        </div>
        <button type="submit">add</button>
      </form>

      <h2>Diary entries</h2>
      {/* Loop (map) through the 'diaries' state and render each entry. */}
      {diaries.map((entry) => (
        <div key={entry.id}>
          <h3>{entry.date}</h3>
          <p>
            visibility: {entry.visibility} <br />
            weather: {entry.weather} <br />
            {/* Display comment from the diary entry, in italics. */}
            <i>{entry.comment}</i>
          </p>
        </div>
      ))}
    </div>
  );
};

export default App;
