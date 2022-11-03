import React, { useState } from "react";
import Button from "ui/Buttons/Button";
import { styled } from "ui/theme/theme";
import PanelButton from "./PanelButton";
import { Chatbubble, VolumeHigh, Videocam } from "react-ionicons";

const StyledSidebar = styled("div", {
  display: "flex",
  flexDirection: "column",
  boxSizing: "border-box",
  alignItems: "start",
  justifyContent: "start",
  height: "100%",
  minWidth: "200px",
  color: "white",

  ".topSpacer": {
    borderLeft: "2px solid $brand",
    boxSizing: "border-box",
    padding: "$md",
  },

  ".controls": {
    borderLeft: "2px solid $brand",
    height: "100%",
    padding: "$md",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
  },
});

export default function StageSidebar() {
  const [activePanel, setActivePanel] = useState<"audio" | "video">("audio");
  return (
    <StyledSidebar>
      <div className="topSpacer" />
      <PanelButton
        onClick={() => {
          setActivePanel("audio");
        }}
        active={activePanel === "audio"}
        icon={<VolumeHigh />}
      >
        Audio
      </PanelButton>
      <PanelButton
        onClick={() => {
          setActivePanel("video");
        }}
        active={activePanel === "video"}
        icon={<Videocam />}
      >
        Video
      </PanelButton>
      <div className="controls">
        <Button icon={<Chatbubble />}>Message</Button>
      </div>
    </StyledSidebar>
  );
}
