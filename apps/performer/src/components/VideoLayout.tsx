import React, { LegacyRef, useEffect, useRef, useState } from "react";
import {
  Participant,
  RemoteTrackPublication,
  Track,
  VideoQuality,
} from "livekit-client";
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
  showDebug,
  participants,
  videoState,
}: {
  participants: Participant[];
  showDebug: boolean;
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
              return (
                <VideoSlot
                  participant={p}
                  key={p.identity}
                  w={(1 / columns) * 100}
                  h={(1 / rows) * 100}
                  x={((i % columns) / columns) * 100}
                  y={((Math.ceil((i + 1) / columns) - 1) / rows) * 100}
                  debug={showDebug}
                />
              );
            })
        : participants.map((p) => (
            <VideoSlot
              debug={showDebug}
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
  debug,
  w,
  h,
  x,
  y,
}: {
  participant: Participant;
  debug: boolean;
  w: number;
  h: number;
  x: number;
  y: number;
}) => {
  const videoRef = useRef<HTMLVideoElement>();
  const [tick, setTick] = useState<number>(0);
  const performer = useParticipant(participant);
  const videoTrack = performer.publications.filter(
    (trackPublication) => trackPublication.kind === Track.Kind.Video
  )?.[0];
  const videoTrackSid = videoTrack?.trackSid;

  useEffect(() => {
    const n = window.setInterval(() => {
      setTick((t) => (t > 10 ? 0 : t + 1));
    }, 1000);
    return () => {
      window.clearInterval(n);
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      if (!videoTrackSid) {
        videoRef.current.src = "";
      } else if (videoTrack) {
        if (!participant.isLocal && !videoTrack.isSubscribed) {
          console.log(`subscribing ${videoTrack.trackSid}`);
          (videoTrack as RemoteTrackPublication).setSubscribed(true);
          (videoTrack as RemoteTrackPublication).setVideoQuality(
            VideoQuality.MEDIUM
          );
        }
        if (!participant.isLocal && !videoTrack.isEnabled) {
          console.log(`enabling ${videoTrack.trackSid}`);
          (videoTrack as RemoteTrackPublication).setEnabled(true);
        }

        if ((videoTrack.videoTrack?.attachedElements?.length || 0) < 1) {
          videoTrack.track?.attach(videoRef.current);
        }
      }
    }
    return () => {
      console.log("disable");
      if (!participant.isLocal && videoTrack) {
        (videoTrack as RemoteTrackPublication).setSubscribed(false);
        (videoTrack as RemoteTrackPublication).setEnabled(false);
      }
    };
  }, [
    videoTrackSid,
    participant.isLocal,
    videoTrack,
    videoTrack?.isSubscribed,
  ]);

  return (
    <VideoContainer
      local={performer.isLocal}
      css={{ width: `${w}%`, height: `${h}%`, left: `${x}%`, top: `${y}%` }}
    >
      <video ref={videoRef as LegacyRef<HTMLVideoElement>} />
      <span className="name">{participant.identity}</span>
      {debug && (
        <div className="debug" key={tick}>
          local: {participant.isLocal ? "yes" : "no"}
          <br />
          track: {videoTrack?.videoTrack?.sid}
          <br />
          simulcasted: {videoTrack?.simulcasted ? "yes" : "no"}
          <br />
          bitrate:{" "}
          {(
            (videoTrack?.videoTrack?.currentBitrate || 0) /
            1024 /
            1024
          ).toFixed(2)}
          mbps
        </div>
      )}
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

  "span.name": {
    position: "absolute",
    background: "$accent-translucent",
    top: "$sm",
    left: "$sm",
    fontSize: "$xs",
    padding: "$2xs",
    zIndex: 3,
  },

  "div.debug": {
    fontFamily: "monospace",
    fontSize: "$2xs",
    textAlign: "left",
    background: "$accent-translucent",
    position: "absolute",
    top: "$3xl",
    left: "$sm",
    padding: "$2xs",
    zIndex: 3,
  },

  video: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    background: "$videoBackgroundGradient",
    zIndex: 1,
  },

  variants: {
    local: {
      true: {
        border: "2px solid $text",
      },
      false: {
        border: "1px solid $background",
      },
    },
  },
});
