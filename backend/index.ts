// index.ts:
import express from "express"; // Import the Express framework to create a web server.
import { calculateBmi } from "./bmiCalculator"; // Import the calculateBmi function, exported from bmiCalculator.ts.
import { calculateExercises } from "./exerciseCalculator"; // 1. Import the calculateExercises function, exported from exerciseCalculator.ts.

const app = express(); // Initialize the Express application instance.
app.use(express.json()); // Middleware: express.json(), intercepts raw JSON string from the client, parses it into a JavaScript object, and populates the 'req.body'.

const PORT = 3003; // Define the port number the server will listen on (3003).
// BMI Calculator
const bmiEndpoint = "/bmi"; // Define our route path (endpoint).
// Define a GET route at the '/bmi' endpoint. 'req' (Request): data from browser, 'res' (Response) data back to the browser.
app.get(bmiEndpoint, (req, res) => {
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
// Exercise Calculator
const exerciseEndpoint = "/exercises"; // Define the URI path for the exercises service as a constant, for easy maintenance.
// Handle HTTP POST requests to the exerciseEndpoint. Unlike GET, POST sends data in the 'body' of the request.
app.post(exerciseEndpoint, (req, res) => {
  // Destructure daily_exercises and target from the request body. By default, the type definitions for Express define req.body as type any. We use the explicit definintion of
  // daily_exercises and target to show that we aknowledge the unsafe type assignment and that we will deal with it.Thus we need to silence no-explicit-any and no-unsafe-assignment alarms.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target }: any = req.body;

  // Level-1 validation: Check if the fields even exist in the request body (json object). Use target === undefined, not !target, because target===0 is false (valid at this level).
  if (!daily_exercises || target === undefined) {
    return res.status(400).json({ error: "parameters missing" });
  }

  // Level-2 validation: Type Guarding. arget must be a number, daily_exercises must be an array of numbers
  if (
    // Check if the target can be cast as a number.
    isNaN(Number(target)) ||
    // Ensure the exercises data is a list [].
    !Array.isArray(daily_exercises) ||
    // Check every element in the array; if one cannot be cast as a number, the input is malformatted.
    daily_exercises.some((d) => isNaN(Number(d)))
  ) {
    // Return a 400 Bad Request status if types are incorrect.
    return res.status(400).json({ error: "malformatted parameters" });
  }
  // At this point, the code is type safe, as it passed all validation.
  // Call the calculator and return result We can cast daily_exercises, as validated above
  const result = calculateExercises(
    // We can safely cast daily_exercises as an array of numbers, as validated above.
    daily_exercises as number[],
    Number(target),
  );
  // Send the final training report object back to the client as json object.
  return res.json(result);
});

// Start the server and listen for incoming connections on PORT 3003.
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  // BMI Calculator:
  console.log(
    `The BMI Calculator service is at: http://localhost:${PORT}${bmiEndpoint} 
     Add query parameters: ?height=<ht-in-cm>&weight=<wht-in-kg> to run the app.
     For example, try this: http://localhost:${PORT}${bmiEndpoint}?height=180&weight=72`,
    // Provide a clickable link and instructions for testing the GET endpoint in a browser.
  );

  // Exercise Calculator:
  console.log(
    `The Exercise Calculator service is at: http://localhost:${PORT}${exerciseEndpoint}
     Use the REST Client script in the test_exercises.rest file, to test the service.`,
    // Provide instructions for testing the POST endpoint. Requires external tool (REST Client).
  );
});
