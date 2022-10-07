import React from "react";
import { styled } from "../theme/theme";

export const ScreenContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100%",
  maxWidth: "620px",

  "@base": {
    gap: "$3xs",
    ".heading": {
      minHeight: "126px",
    },
  },
  "@md": {
    gap: "$xl",
    ".heading": {
      minHeight: "140px",
    },
  },

  ".flex-child": {
    display: "flex",
  },

  ".heading": {
    flexDirection: "column",
    alignItems: "center",
    maxWidth: "600px",

    "@base": {
      span: {
        maxWidth: "400px",
      },
    },
    "@md": {
      span: {
        maxWidth: "500px",
      },
    },
  },
  ".content": {
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
