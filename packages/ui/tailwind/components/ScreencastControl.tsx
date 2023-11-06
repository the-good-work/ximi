import { useLocalParticipant } from "@livekit/components-react";
import classNames from "classnames";
import { createLocalScreenTracks, Track } from "livekit-client";
import { FaTv } from "react-icons/fa6";

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
      ([, track]) => track.videoTrack?.source === Track.Source.ScreenShare,
    ).length > 0;
  const hasCameraTrack =
    Array.from(localParticipant.videoTracks).filter(
      ([, track]) => track.videoTrack?.source === Track.Source.Camera,
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
            const trackToPublish = newTracks.find(
              (t) => t.kind === Track.Kind.Video,
            );
            if (trackToPublish !== undefined) {
              await localParticipant.publishTrack(trackToPublish);
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
