import { useParticipants, useRoomInfo } from "@livekit/components-react";
import * as classNames from "classnames";
import type { LocalParticipant, RemoteParticipant } from "livekit-client";
import {
  FaBinoculars,
  FaDesktop,
  FaMicrophone,
  FaUser,
  FaVideo,
} from "react-icons/fa6";
import {
  MuteAudioAction,
  UnmuteAudioAction,
  XimiParticipantState,
  XIMIRole,
  XimiRoomState,
} from "types";

type ParticipantWithMeta = {
  participant: LocalParticipant | RemoteParticipant;
  meta: XimiParticipantState;
};

const participantSort = (a: ParticipantWithMeta, b: ParticipantWithMeta) => {
  const roles: XIMIRole[] = ["PERFORMER", "SCOUT", "CONTROL"];
  return roles.indexOf(a.meta.role) - roles.indexOf(b.meta.role) !== 0
    ? roles.indexOf(a.meta.role) - roles.indexOf(b.meta.role)
    : a.participant.identity < b.participant.identity
    ? -1
    : 1;
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
        .sort(participantSort)
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
              <FaUser />
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

        <div className="pt-2 mt-2 border-t audiolayout border-text/25">
          <div className="flex flex-wrap gap-2">
            {participants

              .filter((p) => p.participant.identity !== participant.identity)
              .filter((p) => p.meta.role !== "CONTROL")
              .sort(participantSort)

              .map((p) => (
                <AudioChannelBtn
                  key={`b_${p.participant.identity}`}
                  p={p}
                  isMuted={meta.audio.mute.indexOf(p.participant.identity) > -1}
                  onClick={async () => {
                    const patch: MuteAudioAction | UnmuteAudioAction = {
                      type:
                        meta.audio.mute.indexOf(p.participant.identity) > -1
                          ? "unmute-audio"
                          : "mute-audio",
                      roomName: room.name,
                      channel: p.participant.identity,
                      forParticipant: participant.identity,
                    };
                    const r = await fetch(
                      `${import.meta.env.VITE_XIMI_SERVER_HOST}/room/state`,
                      {
                        method: "PATCH",
                        body: JSON.stringify(patch),
                        headers: {
                          "Content-Type": "application/json",
                        },
                      },
                    );
                    return await r.json();
                  }}
                />
              ))}
          </div>
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

    return (
      <div className="p-2 border-2 text-text border-accent box-border">
        <div className="flex items-center justify-between text-sm gap-2">
          <div className="flex items-center gap-2">
            {meta.role === "PERFORMER" ? (
              <FaUser />
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

        <div className="pt-2 mt-2 border-t audiolayout border-accent/">
          <div className="flex flex-wrap gap-2">
            {participants
              .filter((p) => p.participant.identity !== participant.identity)
              .filter((p) => p.meta.role !== "CONTROL")
              .sort(participantSort)
              .map((p) => (
                <AudioChannelBtn
                  key={`b_${p.participant.identity}`}
                  p={p}
                  isMuted={meta.audio.mute.indexOf(p.participant.identity) > -1}
                  onClick={async () => {
                    const patch: MuteAudioAction | UnmuteAudioAction = {
                      type:
                        meta.audio.mute.indexOf(p.participant.identity) > -1
                          ? "unmute-audio"
                          : "mute-audio",
                      roomName: room.name,
                      channel: p.participant.identity,
                      forParticipant: participant.identity,
                    };
                    const r = await fetch(
                      `${import.meta.env.VITE_XIMI_SERVER_HOST}/room/state`,
                      {
                        method: "PATCH",
                        body: JSON.stringify(patch),
                        headers: {
                          "Content-Type": "application/json",
                        },
                      },
                    );
                    return await r.json();
                  }}
                />
              ))}
          </div>
        </div>
      </div>
    );
  } catch (err) {
    return <div>Error: err</div>;
  }
};

const AudioChannelBtn: React.FC<{
  p: ParticipantWithMeta;
  isMuted: boolean;
  onClick: () => Promise<void>;
}> = ({ p, isMuted, onClick }) => {
  const audioChannelBtnCls = classNames(
    "flex items-center relative justify-start w-32 p-1 overflow-hidden text-xs border gap-1 hover:bg-negative/50",
    isMuted ? "border-negative bg-negative/75" : "bg-[transparent] border-text",
    "[&:hover>span]:text-negative",
  );

  const spanCls = classNames(
    "absolute right-0 top-[50%] w-6 h-6 block flex items-center justify-center translate-y-[-50%] text-[10px] font-bold",
    isMuted ? "text-negative" : "text-text/25",
  );

  return (
    <button className={audioChannelBtnCls} onClick={onClick}>
      {p.meta.role === "PERFORMER" ? <FaUser /> : <FaBinoculars />}
      {p.participant.identity}
      <span className={spanCls}>M</span>
    </button>
  );
};
