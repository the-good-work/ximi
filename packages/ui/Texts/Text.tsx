import React from "react";
import { styled } from "../theme/theme";

type Color = "white" | "accent" | "gradient";

const StyledText = styled("span", {
  fontSize: "$sm",
  fontWeight: "normal",
  variants: {
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
  },
  "@base": {
    fontSize: "$2xs",
  },
  "@md": {
    fontSize: "$xs",
  },
});

export default function Text({
  children,
  color = "white",
}: {
  children: any;
  color?: Color;
}) {
  return <StyledText color={color}>{children}</StyledText>;
}
