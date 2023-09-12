import { useLocalParticipant } from "@livekit/components-react";
import * as classNames from "classnames";
import {
  createLocalAudioTrack,
  createLocalVideoTrack,
  Track,
  VideoPresets,
} from "livekit-client";
import { useState } from "react";
import {
  FaVolumeOff,
  FaVolumeHigh,
  FaMicrophone,
  FaCircleDot,
  FaVolumeXmark,
  FaH,
  FaL,
  FaVideo,
} from "react-icons/fa6";

const clsControlBtn = (active: boolean) =>
  classNames(
    "flex",
    "items-center",
    "justify-center",
    "p-1",
    "w-8",
    "h-8",
    "hover:bg-brand/50",
    active ? "text-accent" : "text-text",
  );

const clsControlBtnMute = (muted: boolean) =>
  classNames(
    "flex",
    "items-center",
    "justify-center",
    "p-1",
    "w-8",
    "h-8",
    "rounded-sm",
    muted ? "hover:bg-negative/25" : "hover:bg-negative/50",
    muted ? "border border-negative" : "border-transparent",
    muted ? "bg-negative" : "bg-[transparent]",
    muted ? "hover:text-negative" : "hover:text-text",
  );

const clsToggle = (on: boolean) =>
  classNames(
    "flex w-6 h-6 items-center justify-center relative z-2",
    on ? "text-brand" : "text-text",
  );

const CameraControl = () => {
  const { localParticipant } = useLocalParticipant();
  const hasTrack =
    Array.from(localParticipant.videoTracks).filter(
      ([, track]) => track.videoTrack.source === Track.Source.Camera,
    ).length > 0;
  const [showHint, setShowHint] = useState(false);
  const [mode, setMode] = useState<"HIGH" | "LOW">("HIGH");

  return (
    <div className="flex items-center pr-2 border-r gap-1">
      <button
        className={clsControlBtn(hasTrack)}
        onClick={async () => {
          if (hasTrack) {
            localParticipant.videoTracks.forEach(async ({ track }) => {
              if (track !== undefined) {
                await localParticipant.unpublishTrack(track);
              }
            });
          } else {
            const newTrack = await createLocalVideoTrack({
              resolution:
                mode === "HIGH" ? VideoPresets.h720 : VideoPresets.h360,
            });
            await localParticipant.publishTrack(newTrack);
          }
        }}
      >
        <FaVideo />
      </button>

      <div
        className={`flex items-center h-6 p-0 border rounded-sm ${
          hasTrack ? "opacity-50" : "opacity-100"
        }`}
      >
        <button
          className={`relative flex items-center text-sm toggle gap-0 ${
            hasTrack ? "hover:bg-[transparent]" : "hover:bg-brand/50"
          }`}
          disabled={hasTrack}
          onClick={() => {
            setMode((m) => (m === "HIGH" ? "LOW" : "HIGH"));
          }}
          onMouseEnter={() => setShowHint(true)}
          onMouseLeave={() => setShowHint(false)}
          type="button"
        >
          <div
            className={`p-2 absolute bottom-[calc(100%+3px)] left-[50%] translate-x-[-50%] translate-y-[-10px] bg-bg border border-brand w-32 text-sm transition pointer-events-none ${
              showHint ? "opacity-100" : "opacity-0"
            }`}
          >
            <b className="bg-bg border-brand border-l border-t block absolute w-[12px] h-[12px] bottom-[-6px] left-[50%] translate-x-[-50%] rotate-[-135deg]">
              &nbsp;
            </b>
            {mode === "HIGH" ? <>720p</> : <>360p</>}
          </div>
          <span
            className={`absolute h-full block bg-white z-1 w-6 transition left-0 translate-x-[${
              mode === "HIGH" ? "0" : "100%"
            }] top-0 ${hasTrack ? "opacity-50" : "opacity-100"}`}
          >
            &nbsp;
          </span>
          <div className={clsToggle(mode === "HIGH")}>
            <FaH />
          </div>
          <div className={clsToggle(mode === "LOW")}>
            <FaL />
          </div>
        </button>
      </div>
    </div>
  );
};

export { CameraControl };
