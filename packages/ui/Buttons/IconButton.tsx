import React, { MouseEventHandler, ReactNode } from "react";
import { styled } from "../theme/theme";

const StyledButton = styled("button", {
  aspectRatio: 1,
  span: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "$2xs",
  },
  "&:hover": {
    cursor: "pointer",
    backgroundColor: "$accent-translucent",
  },
  variants: {
    iconSize: {
      sm: {
        span: {
          svg: {
            width: "16px",
            height: "auto",
          },
        },
      },
      md: {
        span: {
          svg: {
            width: "20px",
            height: "auto",
          },
        },
      },
      lg: {
        span: {
          svg: {
            width: "24px",
            height: "auto",
          },
        },
      },
    },
    variant: {
      solid: {
        borderRadius: "$xs",
        border: "2px solid $brand",
        backgroundColor: "$background",
        color: "$text",
      },
      outline: {
        borderRadius: "$xs",
        border: "1px solid $brand",
        backgroundColor: "transparent",
        color: "$text",
      },
      ghost: {
        borderRadius: "$xs",
        border: "none",
        backgroundColor: "transparent",
        color: "$text",
      },
    },
  },
  defaultVariants: {
    variant: "solid",
    iconSize: "sm",
  },
});

export default function IconButton({
  icon,
  iconSize,
  css,
  onClick,
  variant = "solid",
  ...props
}: {
  icon: ReactNode;
  iconSize: any;
  props?: any;
  variant?: "solid" | "ghost" | "outline";
  css?: any;
  onClick?: MouseEventHandler;
}) {
  return (
    <StyledButton
      iconSize={iconSize}
      variant={variant}
      onClick={onClick}
      css={css}
      {...props}
    >
      <div aria-hidden="true">{icon}</div>
    </StyledButton>
  );
}
