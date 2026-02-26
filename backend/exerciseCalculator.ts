// exerciseCalculator.ts:
// Define an interface to structure the expected input data. Thus ensuring type safety for our parsed arguments later in the script.
interface ExerciseInputValues {
  target: number;
  dailyExercisesHours: number[];
}
// Helper function validate the raw string arguments from the terminal. Return data required for exercise calculator.
const parseExerciseInputArguments = (args: string[]): ExerciseInputValues => {
  // target (args[2]) and at least one day's data (args[3]) must be provided (min 4 args).
  if (args.length < 4) throw new Error("Not enough arguments");
  // Cast args[2] as a number.
  const target = Number(args[2]);
  // Validate target value.
  if (isNaN(target)) {
    throw new Error("Target value must be a number!");
  }
  // Capture everything from index 3 to the end of args, as an array of strings
  const inputExerciseHoursArray = args.slice(3);
  // Map through the array of strings casting each to a number
  const dailyExercisesHours = inputExerciseHoursArray.map((arg) => Number(arg));
  // Check if any of the mapped values are NaN. .some returns true if >= one element in the array satisfies condition (isNaN).
  if (dailyExercisesHours.some((arg) => isNaN(arg))) {
    throw new Error("All exercise hours must be numbers!");
  }
  // Return the cleaned and validated data as an object matching our ExerciseInputValues interface.
  return {
    // Shorthand Property Names. TS interprets as target: target,   ... ect.
    target,
    dailyExercisesHours,
  };
};
// Define an interface to structure the final object that will be returned to the user.
interface TrainingReport {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}
// The main function that applies logic to the validated numeric data.
const calculateExercises = (
  trainingHrsPerDay: number[],
  targetHrs: number,
): TrainingReport => {
  // The total number of days (periodLength) is the length of the input trainingHrsPerDay array.
  const periodLength = trainingHrsPerDay.length;
  // trainingDays: .filter creates a new array of only non-zero days; .length counts them.
  const trainingDays = trainingHrsPerDay.filter((hr) => hr > 0).length;
  // .reduce adds up all hours in the array, starting from an initial value of 0.
  const totlTrainingHrPerWeek: number = trainingHrsPerDay.reduce(
    (acc, curr) => acc + curr,
    0,
  );
  const average: number =
    // ternary guard (periodLength === 0 ? 0 :) best practice? However, periodLength > 0, because line-10: if (args.length < 4) throw new Error().
    periodLength === 0 ? 0 : totlTrainingHrPerWeek / periodLength;
  // Boolean flag: true,  if user met or exceeded their target average.
  const success = average >= targetHrs;

  // Initialize vars to be assigned inside the switch block.
  let rating: number;
  let ratingDescription: string;
  // Rating Logic using switch(true) allows us to evaluate conditional expressions.
  switch (true) {
    case average < targetHrs * 0.5:
      rating = 1;
      ratingDescription = "Must try harder.";
      break;

    case average >= targetHrs:
      rating = 3;
      ratingDescription = "Good job. Keep it up.";
      break;

    default:
      // (targetHrs * 0.5) <= average < targetHrs.
      rating = 2;
      ratingDescription = "not too bad but could be better";
      break;
  }

  // Assigning values to the Report object.
  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target: targetHrs,
    average,
  };
};

try {
  // Extract target and daily hours by calling the parser with process.argv.
  const { target, dailyExercisesHours } = parseExerciseInputArguments(
    process.argv,
  );
  // Pass the parsed data into the calculator and print the resulting object.
  console.log(calculateExercises(dailyExercisesHours, target));
} catch (error: unknown) {
  // If an Error was thrown anywhere above, catch it here to prevent a crash. Create simple error measge
  let errorMessage = "Something bad happened.";
  if (error instanceof Error) {
    // Narrow: if error as an Error type (Narrowed), we can safely access .message to create full error message.
    errorMessage += " Error: " + error.message;
  }
  // Print the error message (simple or ful), to the terminal.
  console.log(errorMessage);
}
