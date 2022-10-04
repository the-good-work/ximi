import React from "react";
import { styled } from "../theme/theme";

type Color = "white" | "accent" | "gradient";
type Size = "2xs" | "xs" | "sm" | "md" | "lg";

const StyledText = styled("span", {
  variants: {
    size: {
      "2xs": { "@base": { fontSize: "$3xs" }, "@md": { fontSize: "$2xs" } },
      xs: { "@base": { fontSize: "$2xs" }, "@md": { fontSize: "$xs" } },
      sm: { "@base": { fontSize: "$xs" }, "@md": { fontSize: "$sm" } },
      md: { "@base": { fontSize: "$sm" }, "@md": { fontSize: "$md" } },
      lg: { "@base": { fontSize: "$md" }, "@md": { fontSize: "$lg" } },
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
    color: "white",
    size: "sm",
  },
});

export default function Text({
  children,
  color = "white",
  size = "sm",
  css,
  ...props
}: {
  children: any;
  color?: Color;
  props?: any;
  css?: any;
  size?: Size;
}) {
  return (
    <StyledText size={size} color={color} css={css} {...props}>
      {children}
    </StyledText>
  );
}
