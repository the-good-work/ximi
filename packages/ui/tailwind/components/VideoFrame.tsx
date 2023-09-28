import { useRemoteParticipant, VideoTrack } from "@livekit/components-react";
import * as classNames from "classnames";
import { useEffect, useState } from "react";

export const VideoFrame: React.FC<{ identity: string }> = ({ identity }) => {
  const p = useRemoteParticipant(identity);
  const [videoDisplayState, setVideoDisplayState] = useState<1 | 2 | 3 | 4>(1);
  const [flip, setFlip] = useState(false);
  const [fit, setFit] = useState(false);

  useEffect(() => {
    setFlip(() => videoDisplayState > 2);
    setFit(() => videoDisplayState % 2 === 1);
  }, [videoDisplayState]);

  const videoTracks =
    p?.videoTracks?.size !== undefined && p.videoTracks.size > 0
      ? Array.from(p.videoTracks)
      : [];
  const firstVidTrackPub = videoTracks?.[0];

  if (!p || firstVidTrackPub === undefined) {
    return null;
  }

  const [, firstVid] = firstVidTrackPub;

  return (
    <div className="w-full h-full cursor-pointer bg-bg/50">
      <VideoTrack
        participant={p}
        source={firstVid.source}
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
    </div>
  );
};
