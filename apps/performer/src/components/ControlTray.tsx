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
  Room,
  Track,
  VideoPresets,
} from "livekit-client";

export default function ControlTray({
  room,
  state,
  updateState,
}: {
  room?: Room;
  state: RoomStateStage;
  updateState: Dispatch<UpdateStateActions>;
}) {
  const [open, setOpen] = useState<boolean>(false);
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
        <ToggleIconButton size={open ? "lg" : "md"} icon={<Chatbox />} />
        <ToggleIconButton
          active={true}
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
        bottom: "$md",
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
