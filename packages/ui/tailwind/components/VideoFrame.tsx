import { useRemoteParticipant, VideoTrack } from "@livekit/components-react";
import classNames from "classnames";
import { VideoQuality } from "livekit-client";
import { useEffect, useState } from "react";
import { FaRegSquare, FaTableCells, FaTableCellsLarge } from "react-icons/fa6";

export const VideoFrame: React.FC<{
  identity: string;
  full: boolean;
  preview?: boolean;
}> = ({ identity, full, preview = true }) => {
  const p = useRemoteParticipant(identity);
  const [videoDisplayState, setVideoDisplayState] = useState<1 | 2 | 3 | 4>(
    full ? 2 : 1,
  );
  const [flip, setFlip] = useState(false);
  const [fit, setFit] = useState(false);
  const [quality, setQuality] = useState(
    preview === true ? VideoQuality.MEDIUM : VideoQuality.HIGH,
  );

  useEffect(() => {
    setFlip(() => videoDisplayState > 2);
    setFit(() => videoDisplayState % 2 === 1);
  }, [videoDisplayState]);

  const videoTracks =
    p?.videoTracks?.size !== undefined && p.videoTracks.size > 0
      ? Array.from(p.videoTracks)
      : [];
  const firstVidTrackPub = videoTracks?.[0];
  const [, firstVid] = firstVidTrackPub === undefined ? [,] : firstVidTrackPub;

  useEffect(() => {
    if (firstVid === undefined) {
      return;
    }
    if (typeof firstVid?.setVideoQuality === "function") {
      firstVid.setVideoQuality(quality);
    }
  }, [firstVid, firstVid?.subscriptionStatus, quality]);

  if (!p || firstVidTrackPub === undefined) {
    return null;
  }

  return firstVid === undefined ? (
    <></>
  ) : (
    <div className="relative w-full h-full cursor-pointer">
      <VideoTrack
        trackRef={{
          participant: p,
          publication: firstVidTrackPub[1],
          source: firstVid.source,
        }}
        // participant={p}
        // source={firstVid.source}
        onClick={() => {
          setVideoDisplayState((v) =>
            v === 4 ? 1 : ((v + 1) as 1 | 2 | 3 | 4),
          );
        }}
        className={classNames(
          "w-full h-full cursor-pointer",
          flip === true && "scale-x-[-1]",
          fit === true ? "object-contain" : "object-cover",
        )}
      />
      <button
        className={`absolute top-2 right-2 ${
          preview === false ? "hidden" : ""
        }`}
        onClick={() => {
          setQuality((a) =>
            a === VideoQuality.LOW
              ? VideoQuality.MEDIUM
              : a === VideoQuality.MEDIUM
              ? VideoQuality.HIGH
              : VideoQuality.LOW,
          );
        }}
      >
        {quality === VideoQuality.LOW ? (
          <FaRegSquare />
        ) : quality === VideoQuality.MEDIUM ? (
          <FaTableCellsLarge />
        ) : (
          <FaTableCells />
        )}
      </button>
    </div>
  );
};
