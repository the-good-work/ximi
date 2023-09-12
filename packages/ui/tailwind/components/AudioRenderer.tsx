import {
  AudioTrack,
  useLocalParticipant,
  useRemoteParticipants,
} from "@livekit/components-react";
import { useEffect } from "react";
import { XimiParticipantState } from "types";

const AudioRenderer = () => {
  const remoteParticipants = useRemoteParticipants();
  const { localParticipant } = useLocalParticipant();

  useEffect(() => {
    if (localParticipant.metadata === undefined) {
      console.warn("local participant does not have metadata");
      return;
    }
    try {
      const meta = JSON.parse(
        localParticipant.metadata,
      ) as XimiParticipantState;

      remoteParticipants.forEach((p) => {
        p.audioTracks.forEach((track) => {
          if (meta.audio.mute.indexOf(p.identity) > -1) {
            track.setSubscribed(false);
            track.setEnabled(false);
          } else {
            track.setSubscribed(true);
            track.setEnabled(true);
          }
        });
      });
    } catch (err) {
      console.warn(err);
    }
  }, [remoteParticipants, localParticipant.metadata]);

  return (
    <>
      {remoteParticipants.map((p) => (
        <div key={`audio_renderer_p_${p.identity}`}>
          {Array.from(p.audioTracks).map(([key, track]) => {
            return (
              <AudioTrack participant={p} key={key} source={track.source} />
            );
          })}
        </div>
      ))}
    </>
  );
};

export { AudioRenderer };
