import { useParticipants } from "@livekit/components-react";
import { FaBinoculars, FaUser } from "react-icons/fa6";
import { XimiParticipantState } from "types";
import { VideoFrame } from "./VideoFrame";
import classNames from "classnames";

export const VideoRenderer: React.FC<{ thisPerformerIdentity: string }> = ({
  thisPerformerIdentity,
}) => {
  const participants = useParticipants();

  const filteredParticipants = participants
    .filter((p) => {
      try {
        const pState: XimiParticipantState = JSON.parse(p.metadata || "");
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
    if (thisParticipant === undefined) {
      throw Error("Did not find participant");
    }
    const thisParticipantState = JSON.parse(
      thisParticipant.metadata || "",
    ) as XimiParticipantState;
    const videoState = thisParticipantState.video;

    if (videoState.name === "Auto") {
      const numAutoCols = Math.ceil(Math.sqrt(filteredParticipants.length));
      const numAutoRows = Math.ceil(filteredParticipants.length / numAutoCols);

      return (
        <div
          className={`w-full h-[calc(100vh-96px)] grid gap-1 p-1`}
          style={{
            gridTemplateColumns: `repeat(${numAutoCols}, minmax(0,1fr))`,
            gridTemplateRows: `repeat(${numAutoRows}, minmax(0,1fr))`,
          }}
        >
          {filteredParticipants.map((p) => {
            try {
              const pMeta = JSON.parse(
                p.metadata || "",
              ) as XimiParticipantState;

              return (
                <div
                  key={p.identity}
                  className={classNames(
                    "relative border w-full h-full bg-bg/50",
                    p.identity === thisPerformerIdentity
                      ? "border-accent"
                      : "border-disabled",
                  )}
                >
                  <VideoFrame full={true} identity={p.identity} />
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
      const thisVideoLayout = videoLayouts.find(
        (l) => l.name === videoState.name,
      )?.layout;

      if (!Array.isArray(thisVideoLayout)) {
        return <>layout error</>;
      }
      return (
        <div
          style={{
            gridTemplateColumns: "repeat(12, minmax(0,1fr))",
            gridTemplateRows: "repeat(12, minmax(0,1fr))",
          }}
          className={`w-full h-[calc(100vh-96px)] grid gap-1 p-1`}
        >
          {videoState.layout.map((p, slotNum) => {
            try {
              const meta = filteredParticipants.find(
                (_p) => _p.identity === p.identity,
              )?.metadata;
              const pMeta =
                meta === undefined
                  ? undefined
                  : (JSON.parse(meta) as XimiParticipantState);
              return (
                <div
                  key={`slot_${slotNum}_${p.identity}`}
                  style={{ gridArea: thisVideoLayout?.[slotNum] }}
                  className={classNames(
                    "relative border",
                    p.identity === thisPerformerIdentity
                      ? "border-accent"
                      : "border-disabled",
                  )}
                >
                  <VideoFrame identity={p.identity} full={true} />
                  <label
                    className={classNames(
                      "absolute flex items-center py-1 px-2 leading-snug text-sm rounded-sm top-2 left-2 gap-2",
                      p.identity === thisPerformerIdentity
                        ? "text-text bg-brand/50"
                        : "text-text bg-bg/50",
                    )}
                  >
                    {pMeta === undefined ? (
                      "-"
                    ) : pMeta.role === "PERFORMER" ? (
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
              return <div></div>;
            }
          })}
        </div>
      );
    }
  } catch (err) {
    return <div>Loading video layout</div>;
  }
};

const videoLayouts: {
  image: string;
  layout: string[];
  name: XimiParticipantState["video"]["name"];
}[] = [
  {
    image: "/video-layouts/layout-default.png",
    name: "Auto",
    layout: [],
  },

  {
    image: "/video-layouts/layout-a.png",
    name: "A",
    layout: ["1 / 1 / 13 / 13"],
  },
  {
    image: "/video-layouts/layout-b.png",
    name: "B",

    layout: ["1 / 4 / 7 / 10", "7 / 4 / 13 / 10"],
  },
  {
    image: "/video-layouts/layout-c.png",
    name: "C",
    layout: ["4 / 1 / 10 / 7", "4 / 7 / 10 / 13"],
  },
  {
    image: "/video-layouts/layout-d.png",
    name: "D",
    layout: ["1 / 4 / 7 / 10", "7 / 1 / 13 / 7", "7 / 7 / 13 / 13"],
  },
  {
    image: "/video-layouts/layout-e.png",
    name: "E",
    layout: ["1 / 1 / 7 / 7", "1 / 7 / 7 / 13", "7 / 4 / 13 / 10"],
  },

  {
    image: "/video-layouts/layout-f.png",
    name: "F",
    layout: ["1 / 1 / 13 / 7", "1 / 7 / 7 / 13", "7 / 7 / 13 / 13"],
  },

  {
    image: "/video-layouts/layout-g.png",
    name: "G",
    layout: ["1 / 4 / 7 / 10", "7 / 1 / 13 / 7", "7 / 7 / 13 / 13"],
  },
  {
    image: "/video-layouts/layout-h.png",
    name: "H",

    layout: ["5 / 1 / 9 / 5", "5 / 5 / 9 / 9", "5 / 9 / 9 / 13"],
  },
  {
    image: "/video-layouts/layout-i.png",
    name: "I",
    layout: ["1 / 1 / 13 / 5", "1 / 5 / 13 / 9", "1 / 9 / 13 / 13"],
  },
  {
    image: "/video-layouts/layout-j.png",
    name: "J",
    layout: [
      "1 / 1 / 7 / 7",
      "1 / 7 / 7 / 14",
      "7 / 1 / 13 / 7",
      "7 / 7 / 13 / 13",
    ],
  },
  {
    image: "/video-layouts/layout-k.png",
    name: "K",
    layout: [
      "1 / 1 / 13 / 4",
      "1 / 4 / 13 / 7",
      "1 / 7 / 13 / 10",
      "1 / 10 / 13 / 13",
    ],
  },
];
