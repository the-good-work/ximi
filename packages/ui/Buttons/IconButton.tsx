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
      ghost: {
        borderRadius: "$xs",
        border: "none",
        backgroundColor: "transparent",
        color: "$text",
        "&:hover": {
          cursor: "pointer",
          backgroundColor: "rgba(82, 55, 243, 0.5)",
        },
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
  variant?: "solid" | "ghost";
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
      {icon}
    </StyledButton>
  );
}
