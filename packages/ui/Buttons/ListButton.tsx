import React from "react";
import { styled } from "../theme/theme";
import { People } from "react-ionicons";
import Text from "../Texts/Text";

const StyledButton = styled("li", {
  borderRadius: "$xs",
  border: "2px solid $brand",
  backgroundColor: "$background",
  fontWeight: "$normal",
  fontSize: "$xl",
  color: "$text",
  width: "100%",
  display: "flex",
  padding: "$xs $sm",
  justifyContent: "space-between",
  alignItems: "center",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "$brand",
  },
  path: {
    fill: "CurrentColor",
  },
  ".icon": {
    span: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      svg: {
        width: "20px",
        height: "auto",
      },
    },
  },
  ".participants": {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "$sm",
  },

  "@base": {
    ".icon": {
      width: "$sm",
    },
  },
  "@md": {
    ".icon": {
      width: "$md",
    },
  },
});

export default function ListButton({
  children,
  noOfParticipants,
  as,
  ...props
}: {
  children: any;
  noOfParticipants: number;
  as?: any;
  props?: any;
}) {
  return (
    <StyledButton as={as} {...props}>
      <Text
        css={{ "@base": { fontSize: "$md" }, "@md": { fontSize: "$xl" } }}
        aria-hidden="true"
      >
        {children}
      </Text>
      <div aria-hidden="true" className="participants">
        <div className="icon" aria-hidden="true">
          <People color="inherit" />
        </div>
        <Text
          aria-label={`Number of participants currently in room`}
          css={{ "@base": { fontSize: "$xs" }, "@md": { fontSize: "$sm" } }}
        >
          {noOfParticipants}
        </Text>
      </div>
    </StyledButton>
  );
}
