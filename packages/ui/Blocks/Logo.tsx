import React from "react";
import { styled } from "../theme/theme";

type Color = "gradient" | "white" | "accent";
type Position = "none" | "center";

const StyledImage = styled("div", {
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
    position: {
      center: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      },
      none: {
        position: "static",
      },
    },
    color: {
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
  "@base": {
    width: "64px",
    height: "23px",
  },
  "@md": {
    width: "96px",
    height: "34px",
  },
});

export default function Logo({
  color = "gradient",
  position = "none",
  css,
}: {
  color?: Color;
  css?: any;
  position?: Position;
}) {
  return (
    <StyledImage color={color} css={css} position={position}>
      <div className="image"></div>
    </StyledImage>
  );
}
