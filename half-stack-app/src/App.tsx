// App.tsx:

// Define Types:
// Base interface defines properties shared by all course parts.
interface CoursePartBase {
  name: string;
  exerciseCount: number;
}
// Intermediate interface extends CoursePartBase by adding description attribute, to remove duplication of description in child interfaces.
interface CoursePartDescription extends CoursePartBase {
  description: string;
}
// Interface for basic parts, extends CoursePartBase by adding a description and a literal attribute (kind).
interface CoursePartBasic extends CoursePartDescription {
  kind: "basic";
}
// Interface for group parts, extends CoursePartBase with project count and kind.
interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group";
}
// Interface for background parts, extends CoursePartBase with description, link, and kind.
interface CoursePartBackground extends CoursePartDescription {
  backgroundMaterial: string;
  kind: "background";
}

// Special interface extends CoursePartDescription with a requirements attribute (array of strings).
interface CoursePartSpecial extends CoursePartDescription {
  requirements: string[];
  kind: "special";
}
/* NOTE: Avoid inheritance chains, like this:
            interface CoursePartBackground extends CoursePartBasic {
              backgroundMaterial: string;
              kind: "background";
            }  
         Such multi-level inheritance is NOT considered good practice. If CoursePartBasic is modified CoursePartBackground breaks.
         Extend inheritance and remove duplication without creating a rigid inheritance chain by implementing an intermediate interface (not iused in logic). 
*/

// Union type: CoursePart must be one of the three interfaces defined above.
// Thus, allowing the courseParts array to contain the three different object structures safely.
type CoursePart =
  | CoursePartBasic
  | CoursePartGroup
  | CoursePartBackground
  | CoursePartSpecial;

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
  return <h1>{props.name}</h1>; // Render the name passed in via props
};

// Part component: handles the exhaustive type checking for a single course part. Renders the various attributes for a 'part'
const Part = ({ part }: { part: CoursePart }) => {
  // Helper function for exhaustive type checking:
  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`,
    );
  };
  // Type Narrowing: Because 'part' is a union type, we can't access all attributes directly (they are not all present on all possible types).
  // Thus, use a switch statement on the 'kind' property to narrow the type down.
  switch (part.kind) {
    case "basic": // Here, TypeScript knows 'part' is CoursePartBasic
      return (
        <p>
          <strong>
            {part.name} {part.exerciseCount}
          </strong>
          <br /> {/* Display part name and number of exercises (emboldened). */}
          <em>{part.description}</em>{" "}
          {/* Display other attributes (description emphasised <italic>). */}
        </p>
      );
    case "group": // TypeScript knows 'part' is CoursePartGroup.
      return (
        <p>
          <strong>
            {part.name} {part.exerciseCount}
          </strong>
          <br />
          project exercises {part.groupProjectCount}
        </p>
      );
    case "background": // TypeScript knows 'part' is CoursePartBackground.
      return (
        <p>
          <strong>
            {part.name} {part.exerciseCount}
          </strong>
          <br />
          <em>{part.description}</em>
          <br />
          submit to: {part.backgroundMaterial}
        </p>
      );
    case "special":
      return (
        <p>
          <strong>
            {part.name} {part.exerciseCount}
          </strong>
          <br /> {/* Display part name and number of exercises (emboldened). */}
          <em>{part.description}</em>
          <br />{" "}
          {/* Display other attributes (description emphasised <italic>). */}
          required skills: {part.requirements.join(", ")}{" "}
          {/* return contents of array as single string items separated with comma */}
        </p>
      );
    default:
      return assertNever(part);
  }
};

// Content component. Now simply maps the array and passes each item to the Part component to be rendered.
const Content = (props: ContentProps) => {
  return (
    <div>
      {props.courseParts.map((part) => (
        <Part key={part.name} part={part} /> // "key" helps React efficiently update its lists */}
      ))}
    </div>
  );
};

// Total component: calculates and displays total exercises.
const Total = (props: TotalProps) => {
  // Use reduce() to sum all exerciseCount values in the array.
  const totalExercises = props.courseParts.reduce(
    (sum, part) => sum + part.exerciseCount, // add each part's exercises.
    0, // initial value of sum.
  );

  return <p>Number of exercises {totalExercises}</p>;
};

// Main App component: acts as the root of our UI:
const App = () => {
  const courseName = "Half Stack Application Development"; // Define the course name.
  const courseParts: CoursePart[] = [
    // Define an array of course parts (matching CoursePart interface).
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part",
      kind: "basic",
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: "group",
    },
    {
      name: "Basics of type Narrowing",
      exerciseCount: 7,
      description: "How to go from unknown to string",
      kind: "basic",
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      backgroundMaterial:
        "https://type-level-typescript.com/template-literal-types",
      kind: "background",
    },
    {
      name: "TypeScript in frontend",
      exerciseCount: 10,
      description: "a hard part",
      kind: "basic",
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      kind: "special",
    },
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
