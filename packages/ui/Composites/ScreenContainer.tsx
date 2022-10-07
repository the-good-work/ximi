import React from "react";
import { styled } from "../theme/theme";

export const ScreenContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100%",

  "@base": {
    gap: "$md",
    maxWidth: "600px",
    ".heading": {
      minHeight: "126px",
    },
  },
  "@md": {
    gap: "$xl",
    maxWidth: "650px",
    ".heading": {
      minHeight: "140px",
    },
  },

  ".heading": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",

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
  ".body": {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
});
