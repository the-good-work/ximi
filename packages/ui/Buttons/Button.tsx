import React, { MouseEventHandler, ReactNode } from "react";
import { styled } from "../theme/theme";
import Text from "../Texts/Text";

const StyledButton = styled("button", {
  borderRadius: "$xs",
  border: "2px solid $brand",
  backgroundColor: "$background",
  color: "$text",
  width: "100%",
  display: "flex",
  padding: "$sm $md",
  justifyContent: "flex-start",
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
  onClick,
  css,
  as,
  ...props
}: {
  children: ReactNode;
  icon: ReactNode;
  css?: any;
  onClick?: MouseEventHandler;
  as?: any;
  props?: any;
}) {
  return (
    <StyledButton css={css} as={as} onClick={onClick} {...props}>
      {icon && (
        <div className="icon" aria-hidden="true">
          {icon}
        </div>
      )}
      <Text size="md">{children}</Text>
    </StyledButton>
  );
}
