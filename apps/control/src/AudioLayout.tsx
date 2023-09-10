import { useParticipants, useRoomInfo } from "@livekit/components-react";
import type { LocalParticipant, RemoteParticipant } from "livekit-client";
import {
  FaBinoculars,
  FaDesktop,
  FaMicrophone,
  FaPerson,
  FaVideo,
} from "react-icons/fa6";
import { XimiParticipantState, XIMIRole, XimiRoomState } from "types";

type ParticipantWithMeta = {
  participant: LocalParticipant | RemoteParticipant;
  meta: XimiParticipantState;
};

const AudioLayout = () => {
  const participants = useParticipants();
  const participantsWithMeta: ParticipantWithMeta[] = participants
    .map((p) => {
      let meta;
      try {
        if (p.metadata) {
          meta = JSON.parse(p.metadata);
        }
      } catch (err) {
        console.warn(err);
      }
      return { participant: p, meta: meta as XimiParticipantState };
    })
    .filter((p) => p.meta !== undefined)
    .filter((p) => p.meta.role !== "OUTPUT");

  return (
    <div className="p-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {participantsWithMeta
        .sort((a, b) => {
          const roles: XIMIRole[] = ["PERFORMER", "SCOUT", "CONTROL"];
          return roles.indexOf(a.meta.role) - roles.indexOf(b.meta.role) !== 0
            ? roles.indexOf(a.meta.role) - roles.indexOf(b.meta.role)
            : a.participant.identity < b.participant.identity
            ? -1
            : 1;
        })
        .map((p) =>
          p.participant.isLocal ? (
            <LocalParticipantCard
              key={p.participant.identity}
              participant={p.participant as LocalParticipant}
              participants={participantsWithMeta}
              meta={p.meta}
            />
          ) : (
            <RemoteParticipantCard
              key={p.participant.identity}
              participant={p.participant as RemoteParticipant}
              participants={participantsWithMeta}
              meta={p.meta}
            />
          ),
        )}
    </div>
  );
};

export { AudioLayout };

const RemoteParticipantCard: React.FC<{
  participant: RemoteParticipant;
  meta: XimiParticipantState;
  participants: ParticipantWithMeta[];
}> = ({ participant, participants, meta }) => {
  const room = useRoomInfo();

  try {
    if (room.metadata === undefined) {
      throw new Error("no room metadata");
    }
    const roomState = JSON.parse(room.metadata) as XimiRoomState;

    return (
      <div className="p-2 border text-text box-border">
        <div className="flex items-center justify-between text-sm gap-2">
          <div className="flex items-center gap-2">
            {meta.role === "PERFORMER" ? (
              <FaPerson />
            ) : meta.role === "SCOUT" ? (
              <FaBinoculars />
            ) : (
              <FaDesktop />
            )}{" "}
            <span>{participant.identity}</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`${
                participant.audioTracks.size > 0 ? "text-text" : "text-disabled"
              }`}
            >
              <FaMicrophone />
            </div>
            {meta.role !== "CONTROL" && (
              <div
                className={`${
                  participant.videoTracks.size > 0
                    ? "text-text"
                    : "text-disabled"
                }`}
              >
                <FaVideo />
              </div>
            )}
          </div>
        </div>

        <div className="audiolayout">
          {participants
            .filter((p) => p.participant.identity !== participant.identity)
            .filter((p) => p.meta.role !== "CONTROL")
            .map((p) => (
              <button key={`b_${p.participant.identity}`}>
                {p.meta.role === "PERFORMER" ? <FaPerson /> : <FaBinoculars />}
                {p.participant.identity}
              </button>
            ))}
        </div>
      </div>
    );
  } catch (err) {
    return <div>Error: err</div>;
  }
};

const LocalParticipantCard: React.FC<{
  participant: LocalParticipant;
  meta: XimiParticipantState;
  participants: ParticipantWithMeta[];
}> = ({ participant, participants, meta }) => {
  const room = useRoomInfo();

  try {
    if (room.metadata === undefined) {
      throw new Error("no room metadata");
    }
    const roomState = JSON.parse(room.metadata) as XimiRoomState;
    console.log(roomState);

    return (
      <div className="p-2 border-2 text-text border-accent box-border">
        <div className="flex items-center justify-between text-sm gap-2">
          <div className="flex items-center gap-2">
            {meta.role === "PERFORMER" ? (
              <FaPerson />
            ) : meta.role === "SCOUT" ? (
              <FaBinoculars />
            ) : (
              <FaDesktop />
            )}{" "}
            <span>{participant.identity}</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`${
                participant.audioTracks.size > 0 ? "text-text" : "text-disabled"
              }`}
            >
              <FaMicrophone />
            </div>
            {meta.role !== "CONTROL" && (
              <div
                className={`${
                  participant.videoTracks.size > 0
                    ? "text-text"
                    : "text-disabled"
                }`}
              >
                <FaVideo />
              </div>
            )}
          </div>
        </div>

        <div className="audiolayout">
          {participants
            .filter((p) => p.participant.identity !== participant.identity)
            .filter((p) => p.meta.role !== "CONTROL")
            .map((p) => (
              <button key={`b_${p.participant.identity}`}>
                {p.meta.role === "PERFORMER" ? <FaPerson /> : <FaBinoculars />}
                {p.participant.identity}
              </button>
            ))}
        </div>
      </div>
    );
  } catch (err) {
    return <div>Error: err</div>;
  }
};
