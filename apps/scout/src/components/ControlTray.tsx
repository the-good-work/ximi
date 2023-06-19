import { styled } from "@stitches/react";
import React, { Dispatch, useState } from "react";
import ToggleIconButton from "ui/Buttons/ToggleIconButton";
import {
  Bug,
  Chatbox,
  Exit,
  Videocam,
  VolumeHigh,
  VolumeMute,
  VolumeMuteOutline,
} from "react-ionicons";
import {
  RoomStateStage,
  UpdateStateActions,
} from "../../../../types/performerStates";
import {
  createLocalAudioTrack,
  createLocalVideoTrack,
  Participant,
  Room,
  Track,
  VideoPresets,
} from "livekit-client";
import { PerformerUpdatePayload } from "@thegoodwork/ximi-types/src/room";

export default function ControlTray({
  room,
  open,
  setOpen,
  setOpenMessage,
  state,
  updateState,
  audioMixMute,
  showDebug,
  setShowDebug,
}: {
  room?: Room;
  state: RoomStateStage;

  open: boolean;
  setOpen: Dispatch<boolean>;
  setOpenMessage: Dispatch<boolean>;

  audioMixMute: PerformerUpdatePayload["update"]["audioMixMute"];
  updateState: Dispatch<UpdateStateActions>;

  showDebug: boolean;
  setShowDebug: Dispatch<boolean>;
}) {
  const [muted, setMuted] = useState<boolean>(false);

  const localParticipant = room && room.localParticipant;

  if (!room || !localParticipant) {
    return <></>;
  }

  return (
    <>
      <ButtonTray open={open ? "open" : "closed"}>
        <ToggleIconButton
          size={open ? "lg" : "md"}
          icon={<VolumeHigh />}
          active={localParticipant.audioTracks.size > 0}
          onClick={async () => {
            const currentlyActive = localParticipant.audioTracks.size > 0;

            if (currentlyActive) {
              localParticipant.audioTracks.forEach((track) => {
                if (track.audioTrack) {
                  localParticipant.unpublishTrack(track.audioTrack);
                }
              });
              setMuted(false);
            } else {
              const localAudioTrack = await createLocalAudioTrack({
                noiseSuppression:
                  state.properties.inputType === "voice" ? true : false,
                echoCancellation:
                  state.properties.inputType === "voice" ? true : false,
                channelCount: 2,
                sampleRate: 48000,
                autoGainControl: false,
              });
              await localParticipant.publishTrack(localAudioTrack);
            }
          }}
        />
        <ToggleIconButton
          size={open ? "lg" : "md"}
          icon={muted ? <VolumeMute /> : <VolumeMuteOutline />}
          css={{
            svg: { opacity: localParticipant.audioTracks.size > 0 ? 1 : 0.3 },
          }}
          active={muted}
          onClick={async () => {
            const tracks = Array.from(localParticipant.audioTracks.values());
            if (tracks.length < 1) {
              return;
            }

            if (muted) {
              await Promise.all(
                tracks.map((track) => {
                  return track.unmute();
                })
              );
              setMuted(false);
            } else {
              await Promise.all(
                tracks.map((track) => {
                  return track.mute();
                })
              );

              setMuted(true);
            }
          }}
        />
        <ToggleIconButton
          active={
            Array.from(localParticipant.tracks.values()).filter(
              (publication) => publication.kind === Track.Kind.Video
            ).length > 0
          }
          size={open ? "lg" : "md"}
          icon={<Videocam />}
          onClick={async () => {
            let publishingVideo = false;
            const videoTracks = Array.from(
              localParticipant.tracks.values()
            ).filter((publication) => publication.kind === Track.Kind.Video);

            localParticipant.tracks.forEach((track) => {
              if (publishingVideo) {
                return;
              }
              if (track.kind === Track.Kind.Video) {
                publishingVideo = true;
              }
            });

            if (publishingVideo) {
              await Promise.all(
                videoTracks.map((track) => {
                  if (track.track) {
                    return localParticipant.unpublishTrack(track.track);
                  } else {
                    return null;
                  }
                })
              );
            } else {
              const videoTrack = await createLocalVideoTrack({
                resolution: VideoPresets.h720,
              });
              await localParticipant.publishTrack(videoTrack);
            }
          }}
        />
        <ToggleIconButton
          onClick={() => {
            setOpenMessage(true);
            setOpen(false);
          }}
          size={open ? "lg" : "md"}
          icon={<Chatbox />}
        />
        <ToggleIconButton
          active={showDebug}
          onClick={() => setShowDebug(!showDebug)}
          size={open ? "lg" : "md"}
          icon={<Bug />}
        />
        <ToggleIconButton
          size={open ? "lg" : "md"}
          icon={<Exit />}
          variant="warning"
          onClick={() => {
            const confirm = window.confirm("Are you sure you want to exit?");
            if (!confirm) {
              return;
            }
            room?.disconnect().catch((err) => {
              console.log(err);
            });
            updateState({
              type: "back-to-list",
            });
          }}
        />
      </ButtonTray>
      <AudioStateBar open={open}>
        {<VolumeHigh color="white" width={"16px"} height={"14px"} />}
        {room?.participants &&
          Array.from(room.participants.values())
            .filter(onlyPerformers)
            .filter((performer) => performer.audioTracks.size > 0)
            .map((p) => {
              const isMuted = audioMixMute.indexOf(p.identity) > -1;
              return (
                <span
                  style={{
                    textDecoration: isMuted ? "line-through" : "none",
                    color: isMuted ? "rgba(255,255,255,.3)" : "#fff",
                  }}
                  key={`${p.identity}${isMuted ? "_muted" : ""}`}
                >
                  {p.identity}
                </span>
              );
            })}
      </AudioStateBar>
      {open && (
        <ModalOverlay
          onClick={() => {
            setOpen(false);
          }}
        />
      )}
      <TriggerArea
        open={open ? "open" : "closed"}
        onClick={() => {
          setOpen(true);
        }}
      />
    </>
  );
}

const TriggerArea = styled("div", {
  position: "fixed",
  zIndex: 5000,
  background: "transparent",
  width: "calc(100% - 120px)",
  height: "70px",
  left: "50%",
  transform: "translate(-50%, 0)",
  variants: { open: { open: { bottom: "-200px" }, closed: { bottom: 0 } } },
});

const ButtonTray = styled("div", {
  position: "fixed",
  bottom: "$sm",
  zIndex: 4900,
  display: "flex",
  transition: "all ease .1s",

  ">button + button": {
    borderLeft: "none",
  },
  ">button:first-child()": { borderLeft: "1px solid $brand" },

  variants: {
    open: {
      open: {
        bottom: "$3xl",
      },
      closed: {
        bottom: "$sm",
      },
    },
  },
});

const ModalOverlay = styled("div", {
  position: "fixed",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0,
  zIndex: 4000,
  background: "transparent",
});

const AudioStateBar = styled("div", {
  position: "fixed",
  display: "flex",
  maxWidth: "80%",
  alignItems: "center",
  gap: "$xs",
  left: "50%",
  transform: "translateX(-50%)",
  color: "$text",
  fontSize: "$xs",
  zIndex: 20,
  background: "rgba(0,0,0,.5)",
  padding: "$2xs $xs",

  "> span": {
    display: "flex",
    alignItems: "center",
  },

  variants: {
    open: {
      true: {
        bottom: "$md",
      },
      false: {
        bottom: "-200px",
      },
    },
  },
});

const onlyPerformers = (p: Participant) => {
  try {
    const meta = JSON.parse(p.metadata || "");
    return meta?.type === "PERFORMER";
  } catch (err) {
    return false;
  }
};
