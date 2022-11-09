import { Participant } from "livekit-client";
import React, { Dispatch, SetStateAction, useState } from "react";
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
    layout: [
      "1 / 1 / 5 / 5",
      "1 / 5 / 5 / 9",
      "1 / 9 / 5 / 13",
      "5 / 1 / 9 / 5",
      "5 / 5 / 9 / 9",
      "5 / 9 / 9 / 13",
      "9 / 1 / 13 / 5",
      "9 / 5 / 13 / 9",
      "9 / 9 / 13 / 13",
    ],
  },
  {
    image: "images/video-layouts/layout-b.png",
    name: "B",
    layout: [
      "1 / 1 / 7 / 7",
      "1 / 7 / 7 / 13",
      "7 / 1 / 13 / 7",
      "7 / 7 / 13 / 13",
    ],
  },
  {
    image: "images/video-layouts/layout-c.png",
    name: "C",
    layout: ["4 / 1 / 10 / 7", "4 / 7 / 10 / 13"],
  },
  {
    image: "images/video-layouts/layout-d.png",
    name: "D",
    layout: ["1 / 4 / 7 / 10", "7 / 4 / 13 / 10"],
  },
  {
    image: "images/video-layouts/layout-e.png",
    name: "E",
    layout: ["1 / 1 / 7 / 7", "1 / 7 / 7 / 13", "7 / 4 / 13 / 10"],
  },
  {
    image: "images/video-layouts/layout-f.png",
    name: "F",
    layout: ["1 / 1 / 13 / 13"],
  },
  {
    image: "images/video-layouts/layout-g.png",
    name: "G",
    layout: ["1 / 4 / 7 / 10", "7 / 1 / 13 / 7", "7 / 7 / 13 / 13"],
  },
  {
    image: "images/video-layouts/layout-h.png",
    name: "H",
    layout: ["1 / 1 / 13 / 7", "1 / 7 / 7 / 13", "7 / 7 / 13 / 13"],
  },
  {
    image: "images/video-layouts/layout-i.png",
    name: "I",
    layout: ["1 / 1 / 7 / 7", "7 / 1 / 13 / 7", "1 / 7 / 13 / 13"],
  },
  {
    image: "images/video-layouts/layout-j.png",
    name: "J",
    layout: ["5 / 1 / 9 / 5", "5 / 5 / 9 / 9", "5 / 9 / 9 / 13"],
  },
  {
    image: "images/video-layouts/layout-k.png",
    name: "K",
    layout: ["1 / 1 / 13 / 5", "1 / 5 / 13 / 9", "1 / 9 / 13 / 13"],
  },
  {
    image: "images/video-layouts/layout-l.png",
    name: "L",
    layout: [
      "1 / 1 / 13 / 4",
      "1 / 4 / 13 / 7",
      "1 / 7 / 13 / 10",
      "1 / 10 / 13 / 13",
    ],
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
        ".participants": {
          display: "flex",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          gap: "$sm",
        },
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
            gap: "$sm",
            boxSizing: "border-box",
            display: "flex",
            justifyContent: "center",
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
            ".active": {
              background: "$brand",
            },
          },
        },
      },
    },
  },
});

const VideoGrid = styled("div", {
  display: "grid",
  gridTemplateColumns: "repeat(12, 1fr)",
  gridTemplateRows: "repeat(12, 1fr)",
  minHeight: "400px",
  width: "100%",
  height: "calc(100vh - 9.75rem - 157px)",
  border: "2px solid $brand",
});

const ParticipantVideo = styled("div", {
  background: "$videoBackgroundGradient",
  width: "100%",
  height: "100%",
  display: "flex",
  position: "relative",
  padding: "$md",
  boxSizing: "border-box",
  video: {
    position: "absolute",
    top: "0",
    left: "0",
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

const ParticipantLayout = styled("button", {
  appearance: "none",
  outline: "none",
  border: "none",
  background: "$background",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  boxSizing: "border-box",
  width: "50px",
  gap: "$2xs",
  fontWeight: "$normal",
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
  "&:hover": {
    cursor: "pointer",
    fontWeight: "$bold",
    "> div": {
      background: "$brand",
    },
  },
});

export default function StagePanel({
  activePanel,
  participants,
}: {
  activePanel: PanelStates;
  participants: Participant[];
}) {
  const [currentLayout, setCurrentLayout] = useState<string>("C");
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
      <StyledRoot>
        <StyledViewport>
          <StyledPanel variant="video">
            <div className="video-box">
              <VideoGrid>
                {videoLayouts
                  .find((l) => l.name === currentLayout)
                  ?.layout?.map((l, i) => {
                    return (
                      <ParticipantVideo key={i} css={{ gridArea: l }}>
                        <Text size="xs">NAME</Text>
                      </ParticipantVideo>
                    );
                  })}
              </VideoGrid>
              <div className="layouts">
                {videoLayouts.map((l) => {
                  return (
                    <button
                      key={l.name}
                      onClick={() => {
                        setCurrentLayout(l.name);
                      }}
                      className={`item layout-${l.name} ${
                        l.name === currentLayout ? "active" : ""
                      }`}
                    >
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
        </StyledViewport>
        <Scrollbar orientation="vertical" />
      </StyledRoot>
    );
}