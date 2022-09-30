import React from "react";
import { styled } from "../theme/theme";

type Color = "white" | "accent" | "gradient";

const StyledText = styled("span", {
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
  css,
  ...props
}: {
  children: any;
  color?: Color;
  props?: any;
  css?: any;
}) {
  return (
    <StyledText color={color} css={css} {...props}>
      {children}
    </StyledText>
  );
}
