// index.ts:
import express from "express"; // Import the Express framework to create a web server.
import { calculateBmi } from "./bmiCalculator"; // Import the calculateBmi function, exported from bmiCalculator.ts.

const app = express(); // Initialize the Express application instance.
const PORT = 3003; // Define the port number the server will listen on (3003).
const endpoint = "/bmi"; // Define our route path (endpoint).
// Define a GET route at the '/bmi' endpoint. 'req' (Request): data from browser, 'res' (Response) data back to the browser.
app.get(endpoint, (req, res) => {
  // Get height/weight data from the URL query string, casting them to numbers.
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  // Validate the data. if isNaN(inputData), the casting to number failed. !inputData prevents zero (0) value getting past validation. Zero (0) is false, so !0 is true.
  if (isNaN(height) || isNaN(weight) || !height || !weight) {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  // Call the calculateBmi() function from bmiCalculator.ts with our validated input data. This returns the bmiReport.
  const bmiReport = calculateBmi(height, weight);

  // Return the resulting JSON response: ht and wht as validated input, and resulting BMI report.
  return res.json({
    weight,
    height, // Object property shorthand for height: height.
    bmi: bmiReport,
  });
});
// Start the server and listen for incoming connections on PORT 3003.
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}${endpoint}`);
  console.log(
    // Log instructions for how to use query parameters (?key=value).
    `Add query parameters: ?height=<ht-in-cm>&weight=<wht-in-kg> to run the app.`,
  );
  console.log(
    // Log a clickable link to the terminal for ease ot testing.
    `For example, try this: http://localhost:${PORT}${endpoint}?height=180&weight=72`,
  );
});
