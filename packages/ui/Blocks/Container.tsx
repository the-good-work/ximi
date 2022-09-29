import React from "react";
import Heading from "../Texts/Heading";
import { styled } from "../theme/theme";
import Header from "./Header";
import Logo from "./Logo";

const RoadBlock = styled("div", {
  width: "100%",
  height: "100%",
  padding: "$lg",
  boxSizing: "border-box",
  maxWidth: "600px",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  textAlign: "center",
  gap: "$sm",

  "@base": {
    display: "flex",
  },
  "@sm": {
    display: "none",
  },
});

const StyledContainer = styled("main", {
  width: "100vw",
  height: "100vh",
  background:
    "url('/images/background/dot-grid.png'), linear-gradient($brandGradientA), $background",
  display: "flex",
  textAlign: "center",
  alignItems: "center",
  flexDirection: "column",

  ".frame": {
    width: "100%",
    height: "100%",
    display: "flex",
    textAlign: "center",
    alignItems: "center",
    flexDirection: "column",
  },

  ".content": {
    flexDirection: "column",
    display: "flex",
    alignItems: "center",
  },

  variants: {
    isFullWidth: {
      true: {
        main: {
          maxWidth: "100vh",
        },
      },
      false: {
        main: {
          maxWidth: "1200px",
        },
      },
    },
  },
  defaultVariants: {
    isFullWidth: false,
  },

  "@base": {
    ".frame": { display: "none" },
  },
  "@sm": {
    ".frame": { display: "flex" },
  },
});

export default function Container({
  children,
  isFullWidth = false,
}: {
  children: any;
  isFullWidth?: boolean;
}) {
  return (
    <>
      <StyledContainer isFullWidth={isFullWidth}>
        <div className="frame">
          <Header room={"test"} version={"1.2.5"} />
          <div className="content">{children}</div>
        </div>
        <RoadBlock>
          <Logo css={{ position: "static" }} />
          <Heading level={1} color="white" css={{ fontSize: "$xs" }}>
            You are currently viewing XIMI from an unsupported viewport. Change
            your device or increase your viewport width to 600px and above.
          </Heading>
        </RoadBlock>
      </StyledContainer>
    </>
  );
}
