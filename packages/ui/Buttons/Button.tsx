import React, { MouseEventHandler, ReactNode } from "react";
import { styled } from "../theme/theme";
import Text from "../Texts/Text";

type Variants = "solid" | "keypad" | "keyboard" | "outline";
type ButtonTypes = "primary" | "normal" | "negative";

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

  ".icon": {
    span: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  },

  variants: {
    size: {
      lg: {
        padding: "$sm $md",
        "@base": {
          fontSize: "$md",
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
          fontSize: "$xl",
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
      },
      md: {
        padding: "$sm $md",
        "@base": {
          fontSize: "$sm",
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
          fontSize: "$md",
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
      },
      sm: {
        padding: "$2xs",
        "@base": {
          fontSize: "$2xs",
          ".icon": {
            width: "$sm",
            span: {
              svg: {
                width: "14px",
                height: "auto",
              },
            },
          },
        },
        "@md": {
          fontSize: "$xs",
          ".icon": {
            width: "$md",
            span: {
              svg: {
                width: "24px",
                height: "auto",
              },
            },
          },
        },
      },
    },
    type: {
      primary: {
        background: "$primaryButtonGradient",
      },
      normal: { backgroundColor: "$background" },
      negative: {
        backgroundColor: "$background",
        "&:hover": {
          backgroundColor: "$negative",
          span: { color: "$text" },
          ".icon": {
            span: { path: { fill: "$text" } },
          },
        },
        span: {
          color: "$negative",
        },
        ".icon": {
          span: {
            path: {
              fill: "$negative",
            },
          },
        },
      },
    },
    variant: {
      outline: {
        justifyContent: "flex-start",
        borderColor: "$text",
      },
      solid: {
        justifyContent: "flex-start",
      },
      keypad: {
        justifyContent: "center",
      },
      keyboard: {
        justifyContent: "center",
        "@base": {
          padding: "$xs $sm",
          ".icon": {
            width: "$sm",
          },
        },
        "@md": {
          padding: "$xs $sm",
          ".icon": {
            width: "$md",
          },
        },
      },
    },
  },

  defaultVariants: {
    variant: "solid",
    size: "md",
    type: "normal",
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
  size = "md",
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
  size?: "sm" | "md" | "lg";
}) {
  return (
    <StyledButton
      size={size}
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
      {children && <Text size={size || "md"}>{children}</Text>}
    </StyledButton>
  );
}
