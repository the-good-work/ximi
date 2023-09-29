import {
  useRemoteParticipant,
  useRemoteParticipants,
} from "@livekit/components-react";
import { useState } from "react";
import { XimiParticipantState } from "types";
import * as classNames from "classnames";
import { VideoFrame } from "ui/tailwind";
import { FaBinoculars } from "react-icons/fa6";

const clsSidebarBtn = (active: boolean) =>
  classNames(
    "px-2 py-1 cursor-pointer text-sm",
    active
      ? "bg-brand hover:bg-brand/75"
      : "bg-[transparent] hover:bg-brand/50",
  );

const ScoutVideos = () => {
  const participants = useRemoteParticipants();
  const filteredParticipants = participants
    .filter((p) => {
      try {
        if (p.metadata === undefined) {
          return false;
        }
        const pMeta = JSON.parse(p.metadata) as XimiParticipantState;
        return pMeta.role === "SCOUT";
      } catch (err) {
        console.warn(err);
        return false;
      }
    })
    .sort((a, b) => (a.identity < b.identity ? -1 : 1));

  const numAutoCols = Math.ceil(Math.sqrt(filteredParticipants.length));
  const numAutoRows = Math.ceil(filteredParticipants.length / numAutoCols);

  if (filteredParticipants.length < 1) {
    return (
      <div className="w-full h-[calc(100vh-100px)] flex justify-center items-center">
        Waiting for{" "}
        <span className="text-xs relative top-[.1em] mx-1 p-1 inline-block border leading-3 rounded-sm">
          SCOUT
        </span>
      </div>
    );
  }

  return (
    <div className="w-full h-[calc(100vh-80px)] flex items-stretch">
      <div className="flex flex-col w-full h-full">
        <div className="relative flex-grow">
          <div
            className={`w-full h-[calc(100vh-130px)] grid gap-1 p-1`}
            style={{
              gridTemplateColumns: `repeat(${numAutoCols}, minmax(0,1fr))`,
              gridTemplateRows: `repeat(${numAutoRows}, minmax(0,1fr))`,
            }}
          >
            {filteredParticipants.map((p) => {
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
                    <FaBinoculars size={10} /> {p.identity}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export { ScoutVideos };
