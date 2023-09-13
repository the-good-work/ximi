import { useLocalParticipant } from "@livekit/components-react";
import * as classNames from "classnames";
import {
  createLocalScreenTracks,
  createLocalVideoTrack,
  Track,
  VideoPresets,
} from "livekit-client";
import { useState } from "react";
import { FaH, FaL, FaTabletScreenButton, FaTv, FaVideo } from "react-icons/fa6";

const clsControlBtn = (active: boolean, disabled: boolean) =>
  classNames(
    "flex",
    "items-center",
    "justify-center",
    "p-1",
    "w-8",
    "h-8",
    active ? "text-accent" : "text-text",
    disabled
      ? "hover:bg-[transparent] opacity-50"
      : "hover:brand-50 opacity-100",
  );

const ScreencastControl = () => {
  const { localParticipant } = useLocalParticipant();

  const hasTrack =
    Array.from(localParticipant.videoTracks).filter(
      ([, track]) => track.videoTrack.source === Track.Source.ScreenShare,
    ).length > 0;
  const hasCameraTrack =
    Array.from(localParticipant.videoTracks).filter(
      ([, track]) => track.videoTrack.source === Track.Source.Camera,
    ).length > 0;

  return (
    <div className="flex items-center pr-1 border-r gap-1">
      <button
        className={clsControlBtn(hasTrack, hasCameraTrack)}
        disabled={hasCameraTrack}
        onClick={async () => {
          if (hasTrack) {
            localParticipant.videoTracks.forEach(async ({ track }) => {
              if (track !== undefined) {
                await localParticipant.unpublishTrack(track);
              }
            });
          } else {
            const newTracks = await createLocalScreenTracks({ audio: false });
            if (
              newTracks.filter((t) => t.kind === Track.Kind.Video).length > 0
            ) {
              await localParticipant.publishTrack(
                newTracks.find((t) => t.kind === Track.Kind.Video),
              );
            }
          }
        }}
      >
        <FaTv />
      </button>
    </div>
  );
};

export { ScreencastControl };
