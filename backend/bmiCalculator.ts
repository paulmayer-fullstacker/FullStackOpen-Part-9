// bmiCalculator.ts:
// Define an interface to structure the expected input data. Thus ensuring type safety for our parsed arguments later in the script.
interface HeightWeightValues {
  heightInCm: number;
  weightInKg: number;
}
// Helper function to clean and validate the raw string arguments from the terminal.
const parseHeightWeightArguments = (args: string[]): HeightWeightValues => {
  if (args.length < 4) throw new Error("Not enough arguments");
  if (args.length > 4) throw new Error("Too many arguments");
  /* process.argv always contains 'node' and 'filename' as the first two elements. We expect two more: height and weight.
   args[0]	/usr/local/bin/node	The absolute path to the Node.js executable.
   args[1]	/path/to/project/multiplier.ts	Absolute path to the file being executed.
   args[2]	Our first actual input.
   args[3]	Our second actual input.
*/
  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    // if both inputs can be converted to valid numbers:
    return {
      heightInCm: Number(args[2]),
      weightInKg: Number(args[3]),
    };
  } else {
    // else, throw a helpful error.
    throw new Error("Provided values were not numbers!");
  }
};

// Define Union Type of string literals. A strict "allow-list" of function return values.
type bmiReport = "low BMI" | "normal range" | "Overweight" | "invalid input";
// calculateBmi: takes two numbers and returns one of our predefined status strings.
const calculateBmi = (heightInCm: number, weightInKg: number): bmiReport => {
  // BMI formula uses meters, so we divide the input centimeters by 100.
  const heightInM = heightInCm / 100;
  const bmi = weightInKg / (heightInM * heightInM);
  // Switching on 'true' allows us to use comparison operators in cases
  switch (true) {
    case bmi < 18.5:
      return "low BMI";
    case bmi >= 18.5 && bmi <= 24.9:
      return "normal range";
    case bmi > 24.9:
      return "Overweight";
    default:
      // After input validation, I can't imaging reaching tis.
      return "invalid input";
  }
};

try {
  // Pass process.argv (the array of terminal inputs) to our parser.
  const { heightInCm, weightInKg } = parseHeightWeightArguments(process.argv);
  // Parsed numbers fall through to the calculator. Log the string result.
  console.log(calculateBmi(heightInCm, weightInKg));
} catch (error: unknown) {
  // If anything fails (wrong number of args, not numbers), catch it here.
  let errorMessage = "Something bad happened.";
  // Since 'error' is 'unknown' type, check if it's an instance of Error to access .message.
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
  } // Log the final error message
  console.log(errorMessage);
}
