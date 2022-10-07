import React, { ReactNode, useState } from "react";
import IconButton from "../Buttons/IconButton";
import Heading from "../Texts/Heading";
import { styled } from "../theme/theme";
import Header from "./Header";
import Logo from "./Logo";
import { Contract, Expand } from "react-ionicons";

const RoadBlock = styled("div", {
  width: "100%",
  height: "100%",
  padding: "$lg",
  boxSizing: "border-box",
  maxWidth: "650px",
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
    boxSizing: "border-box",
    flexDirection: "column",
    display: "flex",
    width: "100%",
    height: "100%",
    alignItems: "center",
    overflow: "hidden",
  },

  ".content-scroll": {
    boxSizing: "border-box",
    flexDirection: "column",
    position: "static",
    display: "flex",
    width: "100%",
    height: "100%",
    alignItems: "flex-start",
    overflow: "hidden",
  },

  ".scroll": {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    overflowY: "scroll",
    overflowX: "hidden",
    boxSizing: "border-box",
    width: "calc(100% + 30px)",
  },

  ".noscroll": {
    justifyContent: "center",
    overflow: "hidden",
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
    ".content": { padding: "$md" },
    ".content-scroll .scroll": { padding: "$md" },
  },
  "@sm": {
    ".frame": { display: "flex" },
  },
  "@md": {
    ".content": { padding: "$3xl" },
    ".content-scroll .scroll": { padding: "$3xl" },
  },
});

export default function Container({
  children,
  isFullWidth = false,
  room,
}: {
  children: ReactNode;
  isFullWidth?: boolean;
  room: string;
}) {
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  return (
    <>
      <StyledContainer isFullWidth={isFullWidth}>
        <div className="frame">
          <Header room={room} version={process.env.REACT_APP_VERSION} />
          {children}
          <IconButton
            onClick={() => {
              setIsFullScreen(!isFullScreen);
              let elem = document.getElementById("App");

              if (!document.fullscreenElement) {
                elem?.requestFullscreen().catch((err) => {
                  alert(
                    `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
                  );
                });
              } else {
                document.exitFullscreen();
              }
            }}
            css={{ position: "fixed", bottom: "$sm", right: "$sm" }}
            iconSize="md"
            variant="outline"
            aria-label={`Toggle fullscreen. Fullscreen mode is currently ${
              isFullScreen ? "active" : "inactive"
            }`}
            icon={
              isFullScreen ? (
                <Contract color="inherit" />
              ) : (
                <Expand color="inherit" />
              )
            }
          />
        </div>
        <RoadBlock>
          <Logo css={{ position: "static" }} size="sm" />
          <Heading level={1} color="white" css={{ fontSize: "$xs" }}>
            You are currently viewing XIMI from an unsupported viewport. Change
            your device or increase your viewport width to 600px and above.
          </Heading>
        </RoadBlock>
      </StyledContainer>
    </>
  );
}
