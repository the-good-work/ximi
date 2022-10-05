import React, { ChangeEventHandler, MouseEventHandler, ReactNode } from "react";
import { styled } from "../theme/theme";
import Text from "../Texts/Text";

const StyledInput = styled("input", {
  borderRadius: "$xs",
  fontSize: "$lg",
  textAlign: "center",
  border: "2px solid $brand",
  backgroundColor: "$background",
  color: "$text",
  width: "100%",
  display: "flex",
  padding: "$sm $md",
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
  name,
  type = "text",
  pattern,
  value,
  ...props
}: {
  css?: any;
  onChange?: ChangeEventHandler;
  as?: any;
  props?: any;
  name: string;
  pattern?: string;
  value?: string;
  type?: string;
}) {
  return (
    <StyledInput
      css={css}
      type={type}
      as={as}
      onChange={onChange}
      name={name}
      {...props}
      value={value}
    ></StyledInput>
  );
}
