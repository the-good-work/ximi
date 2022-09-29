import React from "react";
import { styled } from "../theme/theme";
import Header from "./Header";

const StyledContainer = styled("div", {
  width: "100vw",
  height: "100vh",
  background:
    "url('/images/background/dot-grid.png'), linear-gradient($brandGradientA), $background",
  display: "flex",
  textAlign: "center",
  alignItems: "center",
  flexDirection: "column",

  main: {
    flexDirection: "column",
    display: "flex",
    alignItems: "center",
  },

  variants: {
    isFullWidth: {
      true: {
        main: {
          maxWidth: "100vh",
        },
      },
      false: {
        main: {
          maxWidth: "1200px",
        },
      },
    },
  },
  defaultVariants: {
    isFullWidth: false,
  },
});

export default function Container({
  children,
  isFullWidth = false,
}: {
  children: any;
  isFullWidth?: boolean;
}) {
  return (
    <StyledContainer isFullWidth={isFullWidth}>
      <Header room={"test"} version={"1.2.5"} />
      <main>{children}</main>
    </StyledContainer>
  );
}
