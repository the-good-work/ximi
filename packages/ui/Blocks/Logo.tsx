import React from "react";
import { styled } from "../theme/theme";

type Mode = "gradient" | "white" | "accent";

const StyledImage = styled("div", {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "128px",
  height: "46px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  ".image": {
    width: "100%",
    height: "100%",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
  },
  variants: {
    mode: {
      gradient: {
        ".image": {
          backgroundImage: "url('/images/logos/logo-gradient.png')",
        },
      },
      white: {
        ".image": {
          backgroundImage: "url('/images/logos/logo-white.png')",
        },
      },
      accent: {
        ".image": {
          backgroundImage: "url('/images/logos/logo-accent.png')",
        },
      },
    },
  },
});

export default function Logo({ mode = "gradient" }: { mode?: Mode }) {
  return (
    <StyledImage mode={mode}>
      <div className="image"></div>
    </StyledImage>
  );
}
