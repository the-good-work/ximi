import React from "react";
import { styled } from "../theme/theme";

const StyledButton = styled("button", {
  borderRadius: "$xs",
  border: "2px solid $brand",
  backgroundColor: "$background",
  fontWeight: "$normal",
  fontSize: "$xl",
  color: "$text",
  width: "100%",
});

export default function ListButton({ children }: { children: any }) {
  return <StyledButton>{children}</StyledButton>;
}
