import {
  useRemoteParticipant,
  useRemoteParticipants,
  useRoomInfo,
} from "@livekit/components-react";
import { useState } from "react";
import { SetVideoLayoutAction, XimiParticipantState } from "types";
import * as classNames from "classnames";
import { FaBinoculars, FaUser } from "react-icons/fa6";
import { VideoFrame } from "ui/tailwind";

const clsSidebarBtn = (active: boolean) =>
  classNames(
    "px-2 py-1 cursor-pointer text-sm",
    active
      ? "bg-brand hover:bg-brand/75"
      : "bg-[transparent] hover:bg-brand/50",
  );

const vidLayoutBtnCls = (active: boolean) =>
  classNames(
    "flex flex-col items-center w-10 text-xs hover:bg-brand/25 p-1",
    "cursor-pointer",
    active
      ? "bg-brand hover:bg-brand/75"
      : "bg-[transparent] hover:bg-brand/50",
  );

const VideoLayout = () => {
  const participants = useRemoteParticipants();
  const filteredParticipants = participants
    .filter((p) => {
      try {
        if (p.metadata === undefined) {
          return false;
        }
        const pMeta = JSON.parse(p.metadata) as XimiParticipantState;
        return pMeta.role === "PERFORMER";
      } catch (err) {
        console.warn(err);
        return false;
      }
    })
    .sort((a, b) => (a.identity < b.identity ? -1 : 1));
  const [selectedPerformer, setSelectedPerformer] = useState<string>();

  if (filteredParticipants.length < 1) {
    return (
      <div className="w-full h-[calc(100vh-100px)] flex justify-center items-center">
        Waiting for{" "}
        <span className="text-xs relative top-[.1em] mx-1 p-1 inline-block border leading-3 rounded-sm">
          PERFORMER
        </span>
      </div>
    );
  }
  return (
    <div className="w-full h-[calc(100vh-80px)] flex items-stretch">
      <div className="w-20 text-sm border-r md:w-40 md:text-base border-brand">
        {filteredParticipants.map((p) => (
          <div
            key={p.identity}
            className={clsSidebarBtn(selectedPerformer === p.identity)}
            onClick={() => {
              setSelectedPerformer(() => p.identity);
            }}
          >
            {p.identity}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center flex-grow">
        {selectedPerformer === undefined ? (
          <div>
            Select
            <span className="text-xs relative top-[-.05em] mx-1 p-1 inline-block border leading-3 rounded-sm">
              PERFORMER
            </span>{" "}
            on sidebar
          </div>
        ) : (
          <LayoutEditor identity={selectedPerformer} />
        )}
      </div>
    </div>
  );
};

const LayoutEditor: React.FC<{ identity: string }> = ({ identity }) => {
  const p = useRemoteParticipant(identity);
  const participants = useRemoteParticipants();
  const { name: roomName } = useRoomInfo();
  const filteredParticipants = participants
    .filter((p) => {
      try {
        if (p.metadata === undefined) {
          return false;
        }
        const pMeta = JSON.parse(p.metadata) as XimiParticipantState;
        return pMeta.role === "PERFORMER";
      } catch (err) {
        console.warn(err);
        return false;
      }
    })
    .sort((a, b) => (a.identity < b.identity ? -1 : 1));

  try {
    if (p === undefined) {
      return null;
    }
    if (p.metadata === undefined) {
      return null;
    }

    const pMeta = JSON.parse(p.metadata) as XimiParticipantState;
    const curLayout = pMeta.video.name;

    const numAutoCols = Math.ceil(Math.sqrt(filteredParticipants.length));
    const numAutoRows = Math.ceil(filteredParticipants.length / numAutoCols);

    return (
      <div className="flex flex-col w-full h-full">
        <div className="flex justify-center p-1 border-b gap-1 border-brand">
          {videoLayouts.map((layout) => (
            <button
              className={vidLayoutBtnCls(curLayout === layout.name)}
              onClick={async () => {
                const currentLayoutIdentities =
                  pMeta.video.layout === undefined
                    ? []
                    : [...pMeta.video.layout].map((l) => l.identity);
                const numSlots = layout.layout.length;
                const patch: SetVideoLayoutAction = {
                  type: "set-video-layout",
                  roomName: roomName,
                  forParticipant: p.identity,
                  layout: {
                    name: layout.name,
                    layout: new Array(numSlots).fill("").map((_, n) => ({
                      identity: currentLayoutIdentities?.[n] || "",
                      layout: layout.layout[n],
                    })),
                  },
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
            >
              <img src={layout.image} alt={layout.name} className="w-6" />
              <span>{layout.name}</span>
            </button>
          ))}
        </div>
        <div className="relative flex-grow">
          {curLayout === "Auto" ? (
            <div
              className={`w-full h-[calc(100vh-130px)] grid gap-1 p-1`}
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
                      className="relative border border-disabled"
                    >
                      <VideoFrame identity={p.identity} />
                      <label
                        className={classNames(
                          "absolute flex items-center py-1 px-2 leading-snug text-sm rounded-sm top-2 left-2 gap-2",
                          "text-text bg-bg/50",
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
          ) : (
            <div
              className={`w-full h-[calc(100vh-130px)] grid gap-1 p-1 grid-cols-12 grid-rows-12`}
            >
              {curLayout}
            </div>
          )}
        </div>
      </div>
    );
  } catch (err) {
    console.warn(err);
    return <div>Loading...</div>;
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

export { VideoLayout };
