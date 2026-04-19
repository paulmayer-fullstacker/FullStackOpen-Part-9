// App.tsx:

// Define Types:
// Define the structure of a single course part object, with a name and a number of exercises.
interface CoursePart {
  name: string;
  exerciseCount: number;
}
// Define the props expected by the Header component. Required: course name (string).
interface HeaderProps {
  name: string;
}
// Define the props expected by the Content component. Required: array of CoursePart objects.
interface ContentProps {
  courseParts: CoursePart[];
}
// Define the props expected by the Total component. An array of CoursePart objects.
interface TotalProps {
  courseParts: CoursePart[];
}

// Components:
// Header component: displays the course name as a h1 heading.
const Header = (props: HeaderProps) => {
  return <h1>{props.name}</h1>;  // Render the name passed in via props
};

// Content component: loops through the array to display each course part and its exercise count.
const Content = (props: ContentProps) => {
  return (
    <div>
      {props.courseParts.map((part) => (
        // "key" helps React efficiently update its lists
        <p key={part.name}>
          {part.name} {part.exerciseCount} {/* Display part name and number of exercises */}
        </p>
      ))}
    </div>
  );
};

// Total component: calculates and displays total exercises.
const Total = (props: TotalProps) => {
  // Use reduce() to sum all exerciseCount values in the array.
  const totalExercises = props.courseParts.reduce(
    (sum, part) => sum + part.exerciseCount, // add each part's exercises.
    0   // initial value of sum.
  );

  return (
    <p>
      Number of exercises {totalExercises}
    </p>
  );
};

// Main App component: acts as the root of our UI:
const App = () => {
  const courseName = "Half Stack Application Development";  // Define the course name.
  const courseParts: CoursePart[] = [  // Define an array of course parts (matching CoursePart interface).
    {
      name: "Fundamentals",
      exerciseCount: 10
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14
    }
  ];

  return (
    <div>
      {/* Pass the course name to Header as a prop */}
      <Header name={courseName} />
      {/* Pass the courseParts array to Content for rendering */}
      <Content courseParts={courseParts} />
      {/* Pass the same courseParts array to Total to calculate the sum */}
      <Total courseParts={courseParts} />
    </div>
  );
};
// Export App for use in main.tsx
export default App;