import React, { Dispatch, SetStateAction } from "react";
import Button from "ui/Buttons/Button";
import { styled } from "ui/theme/theme";
import PanelButton from "./PanelButton";
import Presets from "./Presets";
import {
  ChatboxSharp,
  VolumeHighSharp,
  VideocamSharp,
  ExitSharp,
} from "react-ionicons";
import {
  PanelStates,
  UpdateStateActions,
} from "../../../../types/controlStates";

const StyledSidebar = styled("div", {
  display: "flex",
  width: "300px",
  flexDirection: "column",
  boxSizing: "border-box",
  alignItems: "start",
  justifyContent: "start",
  height: "100%",

  color: "white",

  ".topSpacer": {
    borderLeft: "2px solid $brand",
    boxSizing: "border-box",
    padding: "$xs",
  },

  ".controls": {
    borderLeft: "2px solid $brand",
    height: "100%",
    width: "100%",
    padding: "$sm",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    boxSizing: "border-box",
    gap: "$sm",

    "> div": {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "$sm",
    },
  },
});

export default function StageSidebar({
  activePanel,
  setActivePanel,
  updateState,
}: {
  activePanel: PanelStates;
  setActivePanel: Dispatch<SetStateAction<PanelStates>>;
  updateState: Dispatch<UpdateStateActions>;
}) {
  return (
    <StyledSidebar>
      <div className="topSpacer" />
      <PanelButton
        onClick={() => {
          setActivePanel("audio");
        }}
        active={activePanel === "audio"}
        icon={<VolumeHighSharp />}
        css={{
          ".icon": {
            span: {
              svg: {
                color: activePanel === "audio" ? "$accent" : "$text",
              },
              "path:not(:last-child)": {
                fill: "none",
              },
            },
          },
        }}
      >
        Audio
      </PanelButton>
      <PanelButton
        onClick={() => {
          setActivePanel("video");
        }}
        active={activePanel === "video"}
        icon={<VideocamSharp />}
      >
        Video
      </PanelButton>
      <div className="controls">
        <div>
          <Button
            icon={<ChatboxSharp />}
            css={{
              textTransform: "uppercase",
              ".icon": {
                span: {
                  path: { fill: "$text" },
                },
              },
            }}
          >
            Message
          </Button>
          <Presets />
        </div>
        <Button
          css={{
            textTransform: "uppercase",
          }}
          icon={<ExitSharp />}
          type="negative"
          onClick={() => {
            updateState({
              type: "back-to-list",
            });
          }}
        >
          Exit
        </Button>
      </div>
    </StyledSidebar>
  );
}
