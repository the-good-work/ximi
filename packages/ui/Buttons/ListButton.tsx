import React from "react";
import { styled } from "../theme/theme";
import { People } from "react-ionicons";
import Text from "../Texts/Text";

const StyledButton = styled("button", {
  borderRadius: "$xs",
  border: "2px solid $brand",
  backgroundColor: "$background",
  fontWeight: "$normal",
  fontSize: "$xl",
  color: "$text",
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "$brand",
  },
  path: {
    fill: "CurrentColor",
  },
  ".participants": {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "$sm",
  },
});

export default function ListButton({
  children,
  noOfParticipants,
}: {
  children: any;
  noOfParticipants: number;
}) {
  return (
    <StyledButton>
      <span>{children}</span>
      <div className="participants">
        <People color="inherit" width="20px" />
        <Text>{noOfParticipants}</Text>
      </div>
    </StyledButton>
  );
}
