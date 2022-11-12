import React from "react";
import { Participant, Room } from "livekit-client";
import { PerformerUpdatePayload } from "@thegoodwork/ximi-types/src/room";
import { styled } from "@stitches/react";
import { useParticipant } from "@livekit/react-core";

const onlyPerformers = (p: Participant) => {
  try {
    const meta = JSON.parse(p.metadata || "");
    return meta?.type === "PERFORMER";
  } catch (err) {
    return false;
  }
};

export default function VideoLayout({
  room,
  participants,
  videoState,
}: {
  room?: Room;
  participants: Participant[];
  videoState: PerformerUpdatePayload["update"]["video"];
}) {
  return (
    <VideoLayoutContainer>
      {videoState.layout === "Default"
        ? participants
            .filter(onlyPerformers)
            .sort((a, b) => (a.identity > b.identity ? -1 : 1))
            .map((p, i, a) => {
              const rows = Math.round(Math.sqrt(a.length));
              const columns = Math.ceil(a.length / rows);
              console.log({ columns });
              return (
                <VideoSlot
                  participant={p}
                  key={p.identity}
                  w={(1 / columns) * 100}
                  h={(1 / rows) * 100}
                  x={((i % columns) / columns) * 100}
                  y={((Math.ceil((i + 1) / columns) - 1) / rows) * 100}
                />
              );
            })
        : participants.map((p) => (
            <VideoSlot
              participant={p}
              w={100}
              h={100}
              key={p.identity}
              x={0}
              y={0}
            />
          ))}
    </VideoLayoutContainer>
  );
}

const VideoSlot = ({
  participant,
  w,
  h,
  x,
  y,
}: {
  participant: Participant;
  w: number;
  h: number;
  x: number;
  y: number;
}) => {
  const performer = useParticipant(participant);
  return (
    <VideoContainer
      local={performer.isLocal}
      css={{ width: `${w}%`, height: `${h}%`, left: `${x}%`, top: `${y}%` }}
    >
      {participant.identity}
    </VideoContainer>
  );
};

const VideoLayoutContainer = styled("div", {
  width: "100%",
  height: "100%",
  position: "relative",
});

const VideoContainer = styled("div", {
  position: "absolute",
  boxSizing: "border-box",
  color: "$text",

  variants: {
    local: {
      true: {
        border: "1px solid $brand",
      },
    },
  },
});
