import React from "react";
import { styled } from "../theme/theme";

type Color = "white" | "accent" | "gradient";

const StyledHeading = styled("span", {
  variants: {
    size: {
      lg: {
        fontSize: "$3xl",
        fontWeight: "normal",
      },
      md: {
        fontSize: "$2xl",
        fontWeight: "normal",
      },
      sm: {
        fontSize: "$xl",
        fontWeight: "normal",
      },
      xs: {
        fontSize: "$lg",
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
    size: "lg",
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
    <StyledHeading
      as={
        level === 1
          ? "h1"
          : level === 2
          ? "h2"
          : level === 3
          ? "h3"
          : level === 4
          ? "h4"
          : level === 5
          ? "h5"
          : "h6"
      }
      color={color}
      size={{
        "@base": "md",
        "@md": "lg",
      }}
      css={css}
    >
      {children}
    </StyledHeading>
  );
}
