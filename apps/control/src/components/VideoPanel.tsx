import { useParticipant } from "@livekit/react-core";
import { Participant } from "livekit-client";
import { useState } from "react";
import Text from "ui/Texts/Text";
import { styled } from "ui/theme/theme";

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

const StyledVideoPanel = styled("div", {
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
  ".participants": {
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: "$sm",
  },
});

export default function VideoPanel({
  currentParticipant,
  participants,
}: {
  currentParticipant: Participant;
  participants: Participant[];
}) {
  const [currentLayout, setCurrentLayout] = useState<string>("F");
  const participantData = useParticipant(currentParticipant);

  return (
    <StyledVideoPanel>
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

      <div className="participants">
        {participants.map((p: any) => {
          if (JSON.parse(p.metadata).type !== "CONTROL") {
            const currentVideoLayout = videoLayouts.find(
              (l) => l.name === currentLayout
            );
            return (
              <ParticipantLayout>
                <div>
                  <img
                    src={currentVideoLayout?.image}
                    alt={currentVideoLayout?.name}
                  />
                </div>
                <Text size="xs">{p.identity}</Text>
              </ParticipantLayout>
            );
          }
        })}
      </div>
    </StyledVideoPanel>
  );
}
