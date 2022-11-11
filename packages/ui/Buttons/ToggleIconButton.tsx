import React, { MouseEventHandler, ReactNode } from "react";
import { CSS, styled } from "@stitches/react";

export default function ToggleIconButton({
  icon,
  onClick,
  css,
  className,
  active = false,
  size = "md",
  variant,
  ...props
}: {
  icon: ReactNode;
  css?: CSS;
  active?: boolean;
  onClick?: MouseEventHandler;
  className?: string;
  size?: "md" | "lg";
  props?: any;
  variant?: "warning";
}) {
  return (
    <StyledToggleIconButton
      {...props}
      onClick={onClick}
      css={css}
      className={className}
      size={size}
      variant={variant}
      active={active ? "active" : "inactive"}
    >
      <b className="indicator" />
      {icon}
    </StyledToggleIconButton>
  );
}

const StyledToggleIconButton = styled("button", {
  position: "relative",
  background: "$background",
  color: "$text",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "$xs",
  border: "1px solid $brand",
  transition: "all ease .3s",
  cursor: "pointer",

  "&:hover": {
    background: "$accent-translucent",
  },

  "> b.indicator": {
    position: "absolute",
    width: "100%",
    height: "0px",
    bottom: "100%",
    display: "block",
    background: "$brand",
    left: "0",
  },

  "> span": {
    color: "$text",
    display: "block",

    "> svg": {
      width: "100%",
      height: "100%",
      display: "block",
      color: "inherit",
      fill: "inherit",
      path: { fill: "$text" },
    },
  },

  variants: {
    size: {
      md: {
        width: "$2xl",
        height: "$2xl",
      },

      lg: {
        width: "60px",
        height: "60px",
      },
    },

    active: {
      active: {
        "> b.indicator": {
          height: "8px",
        },
      },
      inactive: {
        "b.indicator": {
          height: "0",
        },
      },
    },

    variant: {
      warning: {
        "> span": {
          color: "$negative",

          "> svg": {
            path: { fill: "$negative" },
          },
        },
      },
    },
  },
});
