import React, { MouseEventHandler, ReactNode } from "react";
import { styled } from "../theme/theme";
import Text from "../Texts/Text";

type Variants = "solid" | "keypad";

const StyledButton = styled("button", {
  borderRadius: "$xs",
  border: "2px solid $brand",
  backgroundColor: "$background",
  color: "$text",
  width: "100%",
  display: "flex",
  padding: "$sm $md",

  gap: "$sm",
  alignItems: "center",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "$brand",
  },
  path: {
    fill: "CurrentColor",
  },
  ".icon": {
    span: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  },

  variants: {
    variant: {
      solid: {
        justifyContent: "flex-start",
      },
      keypad: {
        justifyContent: "center",
      },
    },
  },

  "@base": {
    ".icon": {
      width: "$sm",
      span: {
        svg: {
          width: "20px",
          height: "auto",
        },
      },
    },
  },
  "@md": {
    ".icon": {
      width: "$md",
      span: {
        svg: {
          width: "40px",
          height: "auto",
        },
      },
    },
  },
});

export default function Button({
  children,
  icon,
  variant = "solid",
  onClick,
  css,
  as,
  type,
  className,
  ...props
}: {
  children: ReactNode;
  icon?: ReactNode;
  variant?: Variants;
  css?: any;
  onClick?: MouseEventHandler;
  as?: any;
  type?: string;
  props?: any;
  className?: string;
}) {
  return (
    <StyledButton
      variant={variant}
      css={css}
      className={className}
      as={as}
      onClick={onClick}
      {...props}
    >
      {icon && (
        <div className="icon" aria-hidden="true">
          {icon}
        </div>
      )}
      <Text size="md">{children}</Text>
    </StyledButton>
  );
}
