import React from "react";
import { styled } from "../theme/theme";

type Color = "white" | "accent" | "gradient";

const StyledHeading = styled("span", {
  variants: {
    level: {
      1: {
        fontSize: "$3xl",
        fontWeight: "normal",
      },
    },
    color: {
      white: { color: "$text" },
      accent: { color: "$accent" },
      gradient: {
        color: "none",
        background: "linear-gradient($brandGradientB)",
        "-webkit-background-clip": "text",
        "-webkit-text-fill-color": "transparent",
        "-moz-background-clip": "text",
        "-moz-text-fill-color": "transparent",
      },
    },
  },

  defaultVariants: {
    color: "default",
    level: 1,
  },
});

export default function Heading({
  children,
  css,
  color = "white",
  level = 1,
}: {
  children: any;
  color?: Color;
  level?: 1;
  css?: any;
}) {
  return (
    <StyledHeading color={color} level={level} css={css}>
      {children}
    </StyledHeading>
  );
}
