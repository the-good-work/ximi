import React from "react";
import { styled } from "@stitches/react";

const StyledContainer = styled("div", {
  width: "100vw",
  height: "100vh",
  maxWidth: "1200px",
  backgroundColor: "purple",
});

export default function Container({ children }: { children: any }) {
  return <StyledContainer>{children}</StyledContainer>;
}
