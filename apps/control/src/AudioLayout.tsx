import { useParticipants, useRoomInfo } from "@livekit/components-react";
import * as classNames from "classnames";
import type { LocalParticipant, RemoteParticipant } from "livekit-client";
import {
  FaBinoculars,
  FaCheck,
  FaDesktop,
  FaMicrophone,
  FaUser,
  FaVideo,
  FaVideoSlash,
  FaVolumeHigh,
  FaVolumeXmark,
} from "react-icons/fa6";
import {
  MuteAudioAction,
  SetAudioDelayAction,
  UnmuteAudioAction,
  XimiParticipantState,
  XIMIRole,
} from "types";
import Copy from "react-copy";
import { toast } from "react-hot-toast";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Pinger } from "./Ping";

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
    <div className="p-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
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
            <span>{participant.identity}</span>{" "}
            <span className="text-accent">
              <Pinger participant={participant} />
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`${
                participant.audioTracks.size > 0 ? "text-text" : "text-disabled"
              }`}
            >
              <FaMicrophone />
            </div>
            {participant.videoTracks.size}
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

        <div className="mt-2 border-t audiolayout border-text/25">
          <div className="flex flex-wrap py-2 gap-2">
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

          {meta.role !== "CONTROL" && (
            <div className="flex justify-between w-full border-t border-text/25">
              <div>
                <label className="text-xs">Out Link</label>
                <div className="flex items-center justify-start p-0 gap-1">
                  <CopyButton
                    copyText={`${
                      import.meta.env.VITE_XIMI_OUTPUT_HOST
                    }/specialhash`}
                  >
                    <FaVideo /> + <FaVolumeHigh />
                  </CopyButton>

                  <CopyButton
                    copyText={`${
                      import.meta.env.VITE_XIMI_OUTPUT_HOST
                    }/specialhash`}
                  >
                    <FaVideo /> + <FaVolumeXmark />
                  </CopyButton>
                  <CopyButton
                    copyText={`${
                      import.meta.env.VITE_XIMI_OUTPUT_HOST
                    }/specialhash`}
                  >
                    <FaVideoSlash /> + <FaVolumeHigh />
                  </CopyButton>
                </div>
              </div>

              <div className="pl-2 border-l border-text/25">
                <label className="text-xs">Out Delay</label>
                <DelayInput
                  curDelay={meta.audio.delay || 0}
                  setDelay={async (n) => {
                    const patch: SetAudioDelayAction = {
                      type: "set-audio-delay",
                      roomName: room.name,
                      forParticipant: participant.identity,
                      delay: n,
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

                    const res = await r.json();

                    if (res.ok) {
                      toast(`Set ${participant.identity} delay to ${n}ms`, {
                        position: "bottom-right",
                        className: "bg-brand/80 text-text rounded-none",
                      });
                    } else {
                      console.warn("error setting delay", res);
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } catch (err) {
    console.log(err);
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
              .map((p) => {
                return (
                  <AudioChannelBtn
                    key={`b_${p.participant.identity}`}
                    p={p}
                    isMuted={
                      meta.audio.mute.indexOf(p.participant.identity) > -1
                    }
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
                );
              })}
          </div>
        </div>
      </div>
    );
  } catch (err) {
    console.log(err);
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

const CopyButton: React.FC<{ children: ReactNode; copyText: string }> = ({
  children,
  copyText,
}) => {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(() => false);
      }, 2000);
    }
  }, [copied]);

  const copyBtnCls = classNames(
    copied ? "bg-brand" : "bg-[transparent]",
    "flex gap-1 text-sm items-center p-1 border border-text w-16 h-7 justify-center",
  );

  return (
    <div>
      <Copy
        textToBeCopied={copyText}
        className="overflow-hidden w-0 h-[1px] block"
        onCopy={() => {
          toast("Copied link", {
            position: "bottom-right",
            className: "bg-brand/80 text-text rounded-none",
          });

          setCopied(() => true);
        }}
      >
        <button className={copyBtnCls}>
          {copied ? <FaCheck /> : children}
        </button>
      </Copy>
    </div>
  );
};

const DelayInput: React.FC<{
  curDelay: number;
  setDelay: (n: number) => Promise<void>;
}> = ({ curDelay, setDelay }) => {
  const [input, setInput] = useState("");
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef(null);

  const submitDelay = async () => {
    const cleanNum = Math.max(0, parseInt(input));
    if (isNaN(cleanNum)) {
      setInput("0");
      await setDelay(0);
    } else {
      await setDelay(cleanNum);
      setInput("");
    }
  };

  return (
    <div className="flex text-sm border border-text">
      <div
        className="w-12 py-1 text-center cursor-pointer"
        onClick={() => {
          (inputRef.current as unknown as HTMLInputElement)?.select();
        }}
      >
        {curDelay}
      </div>
      <div className="relative w-12 text-center border-l border-text/25">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onFocus={() => {
            setShowHint(true);
          }}
          onBlur={() => {
            setShowHint(false);
          }}
          onChange={(e) => setInput(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter" || e.key === "Return") {
              submitDelay();
              (e.target as HTMLInputElement).blur();
            }
          }}
          placeholder={curDelay.toString()}
          className="w-full h-full py-1 text-center bg-brand/25 text-text [&::placeholder]:text-text/20"
        />

        <div
          className={`p-2 absolute top-[100%] left-[50%] translate-x-[-50%] translate-y-[10px] bg-bg border border-brand w-24 text-sm transition pointer-events-none ${
            showHint ? "opacity-100" : "opacity-0"
          }`}
        >
          <b className="bg-bg border-brand border-l border-t block absolute w-[12px] h-[12px] top-[-6px] left-[50%] translate-x-[-50%] rotate-[45deg]">
            &nbsp;
          </b>
          Press Enter to apply
        </div>
      </div>
    </div>
  );
};
