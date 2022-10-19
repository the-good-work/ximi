import React, { ReactNode } from "react";
import { styled } from "../theme/theme";

type Color = "white" | "accent" | "gradient";
type Size = "2xs" | "xs" | "sm" | "md" | "lg";

const StyledIcon = styled("div", {
  span: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  variants: {
    size: {
      "2xs": {
        "@base": {
          span: { svg: { width: "$3xs", height: "$3xs" } },
        },
        "@md": {
          span: { svg: { width: "$2xs", height: "$2xs" } },
        },
      },
      xs: {
        "@base": { span: { svg: { width: "$2xs", height: "$2xs" } } },
        "@md": { span: { svg: { width: "$xs", height: "$xs" } } },
      },
      sm: {
        "@base": { span: { svg: { width: "$xs", height: "$xs" } } },
        "@md": { span: { svg: { width: "$sm", height: "$sm" } } },
      },
      md: {
        "@base": { span: { svg: { width: "$sm", height: "$sm" } } },
        "@md": { span: { svg: { width: "$md", height: "$md" } } },
      },
      lg: {
        "@base": { span: { svg: { width: "$md", height: "$md" } } },
        "@md": { span: { svg: { width: "$lg", height: "$lg" } } },
      },
    },
    color: {
      white: { color: "$text" },
      accent: { color: "$accent" },
      gradient: {
        color: "none",
        background: "headingGradient",
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

export default function Icon({
  icon,
  color = "white",
  size = "sm",
  css,
  ...props
}: {
  icon: ReactNode;
  color?: Color;
  props?: any;
  css?: any;
  size?: Size;
}) {
  return (
    <StyledIcon
      size={size}
      color={color}
      css={css}
      aria-hidden="true"
      {...props}
    >
      {icon}
    </StyledIcon>
  );
}
