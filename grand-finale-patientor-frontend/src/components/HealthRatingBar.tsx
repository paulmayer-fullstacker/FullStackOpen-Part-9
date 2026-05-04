// src/components/HealthRatingBar.tsx:
// Visualy represent a patient's health status using Heart icons.

import { Rating } from "@mui/material";
import { Favorite } from "@mui/icons-material";

import { styled } from "@mui/material/styles";

type BarProps = {
  rating: number;
  showText: boolean;
};

// Custom styling for the MUI Rating component to change heart colors.
const StyledRating = styled(Rating)({
  iconFilled: {
    color: "#ff6d75"
  },
  iconHover: {
    color: "#ff3d47"
  }
});

const HEALTHBAR_TEXTS = [
  "The patient is in great shape",
  "The patient has a low risk of getting sick",
  "The patient has a high risk of getting sick",
  "The patient has a diagnosed condition"
];

const HealthRatingBar = ({ rating, showText }: BarProps) => {
  return (
    <div className="health-bar">
      <StyledRating
        readOnly
        value={4 - rating}
        max={4}
        icon={<Favorite fontSize="inherit" />}
      />
      {/* Conditional rendering to show the health text description if the parent component has showText={true} */}
      {showText ? <p>{HEALTHBAR_TEXTS[rating]}</p> : null}
    </div>
  );
};

export default HealthRatingBar;
