import {
  AudioTrack,
  useLocalParticipant,
  useRemoteParticipants,
} from "@livekit/components-react";
import { useEffect } from "react";
import {
  FaBinoculars,
  FaUser,
  FaVolumeHigh,
  FaVolumeOff,
  FaVolumeXmark,
} from "react-icons/fa6";
import { XimiParticipantState } from "types";

const AudioRenderer = () => {
  const remoteParticipants = useRemoteParticipants();
  const { localParticipant } = useLocalParticipant();

  const filteredParticipants = remoteParticipants
    .map((p) => {
      try {
        const pState: XimiParticipantState = JSON.parse(p.metadata);
        return { participant: p, role: pState.role };
      } catch (err) {
        return { participant: p };
      }
    })
    .filter((p) => {
      return p.role === "PERFORMER" || p.role === "SCOUT";
    })
    .sort((a, b) => {
      return a.participant.identity < b.participant.identity ? -1 : 1;
    });

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
            track.setEnabled(false);
          } else {
            track.setEnabled(true);
          }
        });
      });
    } catch (err) {
      console.warn(err);
    }
  }, [remoteParticipants, localParticipant.metadata]);

  return (
    <div>
      <div className="flex flex-col gap-1">
        {filteredParticipants.map((p) => {
          const hasAudioTrack = p.participant.audioTracks.size > 0;

          const [_, pub] = hasAudioTrack
            ? Array.from(p.participant.audioTracks)?.[0]
            : [0, undefined];

          const audioTrackMuted =
            pub === undefined ? undefined : !pub.isEnabled;

          return (
            <label
              key={p.participant.identity}
              className="flex items-center px-1 text-xs leading-snug gap-2"
            >
              {hasAudioTrack ? (
                audioTrackMuted ? (
                  <FaVolumeXmark className="text-text" />
                ) : (
                  <FaVolumeHigh className="text-text" />
                )
              ) : (
                <FaVolumeHigh className="text-disabled" />
              )}
              {p.role === "PERFORMER" ? (
                <FaUser size={10} />
              ) : p.role === "SCOUT" ? (
                <FaBinoculars size={10} />
              ) : (
                ""
              )}{" "}
              {p.participant.identity}
            </label>
          );
        })}
      </div>
      {remoteParticipants.map((p) => (
        <div key={`audio_renderer_p_${p.identity}`}>
          {Array.from(p.audioTracks).map(([key, track]) => {
            return (
              <AudioTrack participant={p} key={key} source={track.source} />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export { AudioRenderer };
