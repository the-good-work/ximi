import React, {
  ChangeEventHandler,
  EventHandler,
  FocusEventHandler,
  KeyboardEvent,
} from "react";
import { styled } from "../theme/theme";

const StyledInput = styled("input", {
  borderRadius: "$xs",
  fontSize: "$lg",
  textAlign: "center",
  border: "2px solid $brand",
  backgroundColor: "$background",
  color: "$text",
  width: "100%",
  display: "flex",
  justifyContent: "flex-start",
  gap: "$sm",
  alignItems: "center",
  "&:hover": {
    backgroundColor: "$accent-translucent",
  },
  "&:focus": {
    backgroundColor: "$background",
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

  variants: {
    variant: {
      default: {},
      presets: {
        border: "none",
        fontSize: "$xs",
        textTransform: "uppercase",
      },
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export default function Input({
  onChange,
  variant = "default",
  onBlur,
  css,
  as,
  inputMode,
  onKeyDown,
  autoFocus,
  readOnly,
  type = "text",
  pattern,
  value,
  placeholder,
  maxLength,
  max,
  min,
  ...props
}: {
  min?: number;
  max?: number;
  css?: any;
  variant?: "default" | "presets";
  placeholder?: string;
  onChange?: ChangeEventHandler;
  onBlur?: FocusEventHandler;
  as?: any;
  props?: any;
  pattern?: string;
  value?: string;
  type?: string;
  autoFocus?: any;
  readOnly?: any;
  inputMode?: string;
  maxLength?: string;
  onKeyDown?: EventHandler<KeyboardEvent>;
}) {
  return (
    <StyledInput
      variant={variant}
      placeholder={placeholder}
      onBlur={onBlur}
      maxLength={maxLength}
      readOnly={readOnly}
      autoFocus={autoFocus}
      css={css}
      type={type}
      as={as}
      onChange={onChange}
      onKeyDown={onKeyDown}
      {...props}
      value={value}
      inputMode={inputMode}
      max={max}
      min={min}
    ></StyledInput>
  );
}
