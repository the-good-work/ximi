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
});

export default function Text({
  children,
  color = "white",
}: {
  children: any;
  color?: Color;
}) {
  return (
    <StyledText
      css={{
        "@xs": {
          fontSize: "$xs",
          fontWeight: "extrabold",
        },
        "@sm": {
          fontSize: "$sm",
          fontWeight: "bold",
        },
        "@md": {
          fontSize: "$sm",
          fontWeight: "black",
        },
      }}
      color={color}
    >
      {children}
    </StyledText>
  );
}
