import { Participant } from "livekit-client";
import React, { Dispatch, SetStateAction } from "react";
import { Sad } from "react-ionicons";
import Text from "ui/Texts/Text";
import { styled } from "ui/theme/theme";
import { PanelStates } from "../../../../types/stageStates";
import AudioMixCard from "./AudioMixCard";

import { Root, Viewport, Scrollbar } from "@radix-ui/react-scroll-area";

const videoLayouts = [
  {
    image: "images/video-layouts/layout-a.png",
    name: "A",
  },
  {
    image: "images/video-layouts/layout-b.png",
    name: "B",
  },
  {
    image: "images/video-layouts/layout-c.png",
    name: "C",
  },
  {
    image: "images/video-layouts/layout-d.png",
    name: "D",
  },
  {
    image: "images/video-layouts/layout-e.png",
    name: "E",
  },
  {
    image: "images/video-layouts/layout-f.png",
    name: "F",
  },
  {
    image: "images/video-layouts/layout-g.png",
    name: "G",
  },
  {
    image: "images/video-layouts/layout-h.png",
    name: "H",
  },
  {
    image: "images/video-layouts/layout-i.png",
    name: "I",
  },
  {
    image: "images/video-layouts/layout-j.png",
    name: "J",
  },
  {
    image: "images/video-layouts/layout-k.png",
    name: "K",
  },
  {
    image: "images/video-layouts/layout-l.png",
    name: "L",
  },
];

const StyledPanel = styled("div", {
  height: "100%",
  width: "100%",
  color: "white",
  gridGap: "$md",
  boxSizing: "border-box",
  paddingRight: "$lg",

  variants: {
    variant: {
      audio: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
      },
      video: {
        display: "flex",
        flexDirection: "column",
        ".participants": { display: "flex", width: "100%" },
        ".video-box": {
          display: "flex",
          boxSizing: "border-box",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          border: "2px solid $brand",
          backgroundColor: "$background",
          padding: "$md $md $xs $md",
          gap: "$sm",
          ".layouts": {
            gap: "$xs",
            boxSizing: "border-box",
            display: "flex",
            justifyContent: "space-around",
            padding: "0 $lg",
            alignItems: "center",
            ".item": {
              appearance: "none",
              outline: "none",
              background: "$background",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "$2xs",
              border: "1px solid $brand",
              width: "50px",
              img: {
                objectFit: "contain",
                width: "100%",
              },
              "&:hover": {
                cursor: "pointer",
                background: "$brand",
              },
            },
          },
        },
      },
    },
  },
});

const VideoGrid = styled("div", {
  display: "grid",
  width: "100%",
  height: "100%",
  border: "2px solid $brand",
  variants: {
    layout: {
      1: {
        // gridTemplateColumns:
      },
      2: {},
      3: {},
      4: {},
      5: {},
      6: {},
      7: {},
      8: {},
      9: {},
      10: {},
      11: {},
      12: {},
    },
  },
});

const StyledEmptyState = styled("div", {
  height: "100%",
  width: "100%",
  color: "white",
  display: "flex",
  opacity: "0.8",
  gap: "$sm",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  ".icon": {
    path: {
      fill: "$text",
    },
  },
});

const StyledRoot = styled(Root, {
  height: "100%",
  width: "100%",
  overflow: "hidden",
});

const StyledViewport = styled(Viewport, {
  height: "100%",
  width: "100%",
});

const ParticipantLayout = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  boxSizing: "border-box",
  width: "50px",
  gap: "$2xs",
  "> div": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    border: "1px solid $brand",
    background: "$background",
    padding: "$2xs",
    img: {
      width: "100%",
      objectFit: "contain",
    },
  },
});

export default function StagePanel({
  activePanel,
  setActivePanel,
  participants,
}: {
  activePanel: PanelStates;
  setActivePanel: Dispatch<SetStateAction<PanelStates>>;
  participants: Participant[];
}) {
  if (activePanel === "audio") {
    if (participants.length <= 0) {
      return (
        <StyledEmptyState>
          <div className="icon" aria-hidden="true">
            <Sad width="32px" height="32px" />
          </div>
          <Text>There is no one in this room</Text>
        </StyledEmptyState>
      );
    } else
      return (
        <StyledRoot>
          <StyledViewport>
            <StyledPanel variant="audio">
              {participants.map((p: any) => {
                return (
                  <AudioMixCard
                    type={JSON.parse(p.metadata).type.toLowerCase()}
                    participant={p}
                    participants={participants}
                  />
                );
              })}
            </StyledPanel>
          </StyledViewport>
          <Scrollbar orientation="vertical" />
        </StyledRoot>
      );
  } else
    return (
      <StyledPanel variant="video">
        <div className="video-box">
          <VideoGrid layout={1}></VideoGrid>
          <div className="layouts">
            {videoLayouts.map((l) => {
              return (
                <button key={l.name} className={`item layout-${l.name}`}>
                  <img src={l.image} alt={`Layout ${l.name}`} />
                </button>
              );
            })}
          </div>
        </div>
        <div className="participants">
          {participants.map((p: any) => {
            if (JSON.parse(p.metadata).type !== "CONTROL") {
              return (
                <ParticipantLayout>
                  <div>
                    <img
                      src={videoLayouts[0].image}
                      alt={videoLayouts[0].name}
                    />
                  </div>
                  <Text size="xs">{p.identity}</Text>
                </ParticipantLayout>
              );
            }
          })}
        </div>
      </StyledPanel>
    );
}
