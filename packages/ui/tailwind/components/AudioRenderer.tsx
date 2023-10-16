import {
  AudioTrack,
  useLocalParticipant,
  useRemoteParticipants,
} from "@livekit/components-react";
import { useEffect, useState } from "react";
import {
  FaBinoculars,
  FaEarListen,
  FaUser,
  FaVolumeHigh,
  FaVolumeXmark,
} from "react-icons/fa6";
import { XimiParticipantState } from "types";
import * as classNames from "classnames";

const AudioRenderer: React.FC<{ hidden?: boolean }> = ({ hidden = false }) => {
  const remoteParticipants = useRemoteParticipants();
  const { localParticipant } = useLocalParticipant();
  const [showLayout, setShowLayout] = useState(true);

  const filteredParticipants = remoteParticipants
    .map((p) => {
      try {
        const pState: XimiParticipantState = JSON.parse(p.metadata || "");
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
    <div
      className={classNames(
        "relative cursor-pointer",
        hidden === true && "hidden",
      )}
      onClick={() => {
        setShowLayout((show) => !show);
      }}
    >
      {showLayout ? (
        <div
          className={classNames(
            "flex flex-col gap-1",
            showLayout ? "block" : "hidden",
          )}
        >
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
                className="flex items-center px-1 text-xs leading-snug cursor-pointer gap-2"
              >
                {hasAudioTrack ? (
                  audioTrackMuted ? (
                    <FaVolumeXmark className="text-negative" />
                  ) : (
                    <FaVolumeHigh className="text-text" />
                  )
                ) : (
                  <FaVolumeHigh className="text-bg" />
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
      ) : (
        <FaEarListen />
      )}

      {remoteParticipants.map((p) => (
        <div
          key={`audio_renderer_p_${p.identity}`}
          className="absolute opacity-0"
        >
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
