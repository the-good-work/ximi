import { styled } from "ui/theme/theme";
import {
  RoomUpdateAction,
  RoomUpdatePayload,
} from "@thegoodwork/ximi-types/src/room";
import {
  Participant,
  RemoteParticipant,
  RemoteTrackPublication,
  Room,
  Track,
  VideoQuality,
} from "livekit-client";
import { useEffect, useRef, useState } from "react";
import Text from "ui/Texts/Text";
import { useParticipant } from "@livekit/react-core";

type Unpacked<T> = T extends (infer U)[]
  ? U
  : T extends (...args: any[]) => infer U
  ? U
  : T extends Promise<infer U>
  ? U
  : T;

export default function ScoutView({
  room,
  participants,
  participantsSettings,
}: {
  room?: Room;
  participants?: Participant[];
  participantsSettings?: (Unpacked<
    RoomUpdatePayload["update"]["participants"]
  > & { type: "SCOUT" })[];
}) {
  const performers =
    participants && participants?.length > 0
      ? participants
          .filter((p: Participant) => {
            try {
              const meta = JSON.parse(p.metadata || "");
              return meta?.type === "SCOUT";
            } catch (err) {
              return false;
            }
          })
          .sort((a, b) => (a.identity > b.identity ? 1 : -1))
      : [];
  const numCols = Math.ceil(Math.sqrt(performers.length));
  const numRows = Math.ceil(performers.length / numCols);

  if (!room || !participantsSettings || !participants) {
    return (
      <div
        style={{
          color: "white",
          height: "70vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Awaiting scouts
      </div>
    );
  }

  if (performers.length < 1) {
    return (
      <div
        style={{
          color: "white",
          height: "70vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Awaiting scouts
      </div>
    );
  }

  return (
    <StyledPanel>
      <div
        className="video-grid"
        style={{
          gridTemplateColumns: `repeat(${numCols}, calc(${100 / numCols}% - ${
            ((numCols - 1) * 2) / numCols
          }px))`,
          gridTemplateRows: `repeat(${numRows}, calc(${100 / numRows}% - ${
            ((numRows - 1) * 2) / numRows
          }px))`,
        }}
      >
        {performers.map((p) => (
          <ParticipantVideo
            participant={p as RemoteParticipant}
            key={p.identity}
          />
        ))}
      </div>
    </StyledPanel>
  );
}

const StyledPanel = styled("div", {
  display: "flex",
  boxSizing: "border-box",
  flexDirection: "column",
  width: "100%",
  height: "85vh",
  border: "2px solid $brand",
  backgroundColor: "$background",
  padding: "$xs",
  gap: "$sm",

  ".video-grid": {
    display: "grid",
    width: "100%",
    height: "100%",
    gap: "2px",

    ">div": {
      width: "100%",
      height: "100%",
      position: "relative",

      video: {
        width: "100%",
        height: "100%",
        position: "relative",
        display: "block",
        objectFit: "contain",
      },

      ">label": {
        position: "absolute",
        top: "$md",
        left: "$md",
        color: "white",
        fontWeight: "500",
      },
    },
  },
});

const ParticipantVideo = ({
  participant,
}: {
  participant: RemoteParticipant;
}) => {
  const p = useParticipant(participant);
  const videoRef = useRef<HTMLVideoElement>();
  const firstVideoTrack = p.publications.find(
    (pub) => pub.kind === Track.Kind.Video
  ) as RemoteTrackPublication | undefined;

  useEffect(() => {
    if (firstVideoTrack) {
      if (!firstVideoTrack.isSubscribed) {
        firstVideoTrack.setSubscribed(true);
      } else {
        firstVideoTrack.setEnabled(true);
        firstVideoTrack.setVideoQuality(VideoQuality.LOW);
        if (videoRef.current) {
          firstVideoTrack.track?.attach(videoRef.current);
        }
      }
    }
  }, [firstVideoTrack, firstVideoTrack?.isSubscribed]);

  return (
    <div>
      <video ref={videoRef as React.LegacyRef<HTMLVideoElement>} />
      <label>{participant.identity}</label>
    </div>
  );
};
