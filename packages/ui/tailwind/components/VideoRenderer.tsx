import { useParticipants } from "@livekit/components-react";
import { FaBinoculars, FaUser } from "react-icons/fa6";
import { XimiParticipantState } from "types";
import { VideoFrame } from "./VideoFrame";
import * as classNames from "classnames";

export const VideoRenderer: React.FC<{ thisPerformerIdentity: string }> = ({
  thisPerformerIdentity,
}) => {
  const participants = useParticipants();

  const filteredParticipants = participants
    .filter((p) => {
      try {
        const pState: XimiParticipantState = JSON.parse(p.metadata);
        return pState.role === "PERFORMER" || pState.role === "SCOUT";
      } catch (err) {
        return false;
      }
    })
    .sort((a, b) => {
      return a.identity < b.identity ? -1 : 1;
    });

  const thisParticipant = filteredParticipants.find(
    (p) => p.identity === thisPerformerIdentity,
  );

  try {
    const thisParticipantState = JSON.parse(
      thisParticipant.metadata,
    ) as XimiParticipantState;
    const videoState = thisParticipantState.video;

    if (videoState.name === "Auto") {
      const numAutoCols = Math.ceil(Math.sqrt(filteredParticipants.length));
      const numAutoRows = Math.ceil(filteredParticipants.length / numAutoCols);

      return (
        <div
          className={`w-full h-full grid gap-1 p-1`}
          style={{
            gridTemplateColumns: `repeat(${numAutoCols}, minmax(0,1fr))`,
            gridTemplateRows: `repeat(${numAutoRows}, minmax(0,1fr))`,
          }}
        >
          {filteredParticipants.map((p) => {
            try {
              const pMeta = JSON.parse(p.metadata) as XimiParticipantState;

              return (
                <div
                  key={p.identity}
                  className={classNames(
                    "relative border w-full h-full",
                    p.identity === thisPerformerIdentity
                      ? "border-accent"
                      : "border-disabled",
                  )}
                >
                  <VideoFrame identity={p.identity} />
                  <label
                    className={classNames(
                      "absolute flex items-center py-1 px-2 leading-snug text-sm rounded-sm top-2 left-2 gap-2",
                      p.identity === thisPerformerIdentity
                        ? "text-text bg-brand/50"
                        : "text-text bg-bg/50",
                    )}
                  >
                    {pMeta.role === "PERFORMER" ? (
                      <FaUser size={10} />
                    ) : pMeta.role === "SCOUT" ? (
                      <FaBinoculars size={10} />
                    ) : (
                      ""
                    )}{" "}
                    {p.identity}
                  </label>
                </div>
              );
            } catch (err) {
              return <div>Participant state error</div>;
            }
          })}
        </div>
      );
    } else {
      if (!Array.isArray(videoState.layout)) {
        return <div>Layout state error</div>;
      }
      return (
        <div
          className={`w-full h-full grid gap-1 p-1 grid-cols-12 grid-rows-12`}
        >
          {videoState.layout.map((p) => {
            try {
              const meta = filteredParticipants.find(
                (_p) => _p.identity === p.identity,
              ).metadata;
              const pMeta = JSON.parse(meta) as XimiParticipantState;
              return (
                <div
                  key={p.identity}
                  className={classNames(
                    "relative border",
                    p.identity === thisPerformerIdentity
                      ? "border-accent"
                      : "border-disabled",
                  )}
                >
                  <VideoFrame identity={p.identity} />
                  <label
                    className={classNames(
                      "absolute flex items-center py-1 px-2 leading-snug text-sm rounded-sm top-2 left-2 gap-2",
                      p.identity === thisPerformerIdentity
                        ? "text-text bg-brand/50"
                        : "text-text bg-bg/50",
                    )}
                  >
                    {pMeta.role === "PERFORMER" ? (
                      <FaUser size={10} />
                    ) : pMeta.role === "SCOUT" ? (
                      <FaBinoculars size={10} />
                    ) : (
                      ""
                    )}{" "}
                    {p.identity}
                  </label>
                </div>
              );
            } catch (err) {
              return <div>Participant state error</div>;
            }
          })}
        </div>
      );
    }
  } catch (err) {
    return <div>Loading video layout</div>;
  }
};
