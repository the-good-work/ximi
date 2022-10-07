import React, { MouseEventHandler, ReactNode } from "react";
import { styled } from "../theme/theme";
import Text from "../Texts/Text";

type Variants = "solid" | "keypad" | "keyboard";
type ButtonTypes = "primary" | "normal";

const StyledButton = styled("button", {
  borderRadius: "$xs",
  border: "2px solid $brand",
  color: "$text",
  width: "100%",
  display: "flex",

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

  "@base": {
    ".icon": {
      width: "$md",
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
      width: "$lg",
      span: {
        svg: {
          width: "40px",
          height: "auto",
        },
      },
    },
  },

  variants: {
    type: {
      primary: {
        background: "linear-gradient($brandGradientC)",
      },
      normal: { backgroundColor: "$background" },
    },
    variant: {
      solid: {
        justifyContent: "flex-start",
        padding: "$sm $md",
      },
      keypad: {
        justifyContent: "center",
        padding: "$sm $md",
      },
      keyboard: {
        justifyContent: "center",
        padding: "$xs $sm",
        "@base": {
          ".icon": {
            width: "$sm",
          },
        },
        "@md": {
          ".icon": {
            width: "$md",
          },
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
  type = "normal",
  className,
  ...props
}: {
  children?: ReactNode;
  icon?: ReactNode;
  variant?: Variants;
  css?: any;
  onClick?: MouseEventHandler;
  as?: any;
  type?: ButtonTypes;
  props?: any;
  className?: string;
}) {
  return (
    <StyledButton
      variant={variant}
      css={css}
      type={type}
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
      {children && <Text size="md">{children}</Text>}
    </StyledButton>
  );
}
