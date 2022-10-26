import React, { ChangeEventHandler, EventHandler, KeyboardEvent } from "react";
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
});

export default function Input({
  onChange,
  css,
  as,
  inputMode,
  onKeyDown,
  autoFocus,
  readOnly,
  type = "text",
  pattern,
  value,
  maxLength,
  ...props
}: {
  css?: any;
  onChange?: ChangeEventHandler;
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
    ></StyledInput>
  );
}
