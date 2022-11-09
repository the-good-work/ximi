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
import { UpdateStateActions } from "../../../../types/controlStates";
import { PanelStates, PresetAction } from "../../../../types/stageStates";

const StyledSidebar = styled("div", {
  display: "flex",
  width: "250px",
  flexDirection: "column",
  boxSizing: "border-box",
  alignItems: "start",
  justifyContent: "start",
  height: "100%",
  color: "$text",

  ".topSpacer": {
    borderLeft: "2px solid $brand",
    boxSizing: "border-box",
    padding: "0",
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
  presets,
  setPresets,
}: {
  activePanel: PanelStates;
  setActivePanel: Dispatch<SetStateAction<PanelStates>>;
  updateState: Dispatch<UpdateStateActions>;
  presets: any[];
  setPresets: Dispatch<PresetAction>;
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
            size="sm"
            icon={<ChatboxSharp />}
            css={{
              alignItems: "center",
              justifyContent: "center",
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
          <Presets presets={presets} setPresets={setPresets} />
        </div>
        <Button
          size="sm"
          css={{
            alignItems: "center",
            justifyContent: "center",
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
