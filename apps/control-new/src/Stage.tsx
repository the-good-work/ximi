import { useParticipants, useRoomInfo } from "@livekit/components-react";
import { useEffect, useMemo, useState } from "react";
import * as classNames from "classnames";
import {
  FaA,
  FaDesktop,
  FaEye,
  FaFloppyDisk,
  FaUpload,
  FaVideo,
  FaVolumeHigh,
  FaVolumeLow,
} from "react-icons/fa6";
import { SwitchActivePresetAction, XimiRoomState } from "types";
import { PresetRenamer } from "./PresetRenamer";
import { IconType } from "react-icons";

const ARR_12 = new Array(12).fill(0);

type LayoutType = "AUDIO" | "VIDEO" | "SCOUT VIDEO" | "SCOUT TEXT";

const setActivePreset = async (
  roomName: string,
  n: SwitchActivePresetAction["activePreset"],
) => {
  const patch: SwitchActivePresetAction = {
    type: "set-active-preset",
    activePreset: n,
    roomName,
  };
  await fetch(`${import.meta.env.VITE_XIMI_SERVER_HOST}/room/state`, {
    method: "PATCH",
    body: JSON.stringify(patch),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const Stage = () => {
  const meta = useRoomInfo();
  const [roomState, setRoomState] = useState<XimiRoomState | undefined>();
  const [tab, setTab] = useState<LayoutType>("AUDIO");
  const activePreset = roomState?.activePreset || 0;

  useEffect(() => {
    try {
      if (meta.metadata === undefined) {
        return;
      }
      const state = JSON.parse(meta.metadata) as XimiRoomState;
      setRoomState(state);
    } catch (err) {
      console.log(err);
    }
  }, [meta.metadata, setRoomState]);

  if (roomState === undefined) {
    return (
      <div id="stage__loading" className="h-[calc(100vh-33px)] relative w-full">
        Loading...
      </div>
    );
  }

  return (
    <div
      id="stage__base"
      className="h-[calc(100vh-33px)] relative w-full grid grid-cols-[auto_40px]"
    >
      <div className="relative h-[100%] bg-bg overflow-y-scroll p-0 flex flex-col gap-0">
        <div className="sticky top-0 w-full h-12 m-0 z-4 bg-bg box-border"></div>

        <div className="min-h-[calc(100%-90px)] box-border m-0"></div>

        <div className="sticky bottom-[2px] w-full h-10 px-1 pb-2 box-border border-t border-brand">
          <div className="flex items-center justify-between w-full h-full">
            <div className="flex items-center gap-2">
              <FaDesktop />
              <PresetRenamer key={`renamer_slot_${activePreset}`} />
            </div>

            <TabSwitcher tab={tab} setTab={setTab} />
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between border-l bg-bg border-brand">
        <nav id="preset_tab">
          {ARR_12.map((_, n) => {
            const className = classNames(
              n === activePreset ? "bg-brand" : "bg-bg",
              n === activePreset ? "text-text" : "text-text/50",
              "border-b",
            );
            return (
              <button
                type="button"
                onClick={async () => {
                  await setActivePreset(
                    meta.name,
                    n as SwitchActivePresetAction["activePreset"],
                  );
                }}
                key={`preset_slot_${n}`}
                className={`relative w-full h-8 flex border-brand items-center justify-center box-border block text-sm hover:bg-brand/70 hover:text-text ${className} [&:hover_span.name-tip]:block`}
              >
                {n + 1}
                {activePreset === n && (
                  <span className="absolute top-{50%} right-0 block w-1 h-1 unsaved-indicator bg-white translate-y-{-50%}">
                    &nbsp;
                  </span>
                )}
                <span className="hidden absolute w-24 p-1  border name-tip right-[calc(100%+10px)] bg-bg/50 border-brand">
                  {roomState.presets[n].name}
                  <b className="block absolute w-2 h-2 border border-t-0 border-l-0 arrow border-brand right-0 top-[50%] rotate-[-45deg] translate-x-[60%] translate-y-[-50%] bg-bg">
                    {" "}
                  </b>
                </span>
              </button>
            );
          })}
        </nav>
        <div className="flex flex-col p-2 gap-2">
          <button>
            <FaFloppyDisk size={20} />
          </button>

          <button>
            <FaUpload size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

const TabSwitcher: React.FC<{
  tab: LayoutType;
  setTab: React.Dispatch<React.SetStateAction<LayoutType>>;
}> = ({ tab, setTab }) => {
  const layouts: { type: LayoutType; icon: JSX.Element }[] = [
    { type: "AUDIO", icon: <FaVolumeHigh /> },
    { type: "VIDEO", icon: <FaVideo /> },
    { type: "SCOUT VIDEO", icon: <FaEye /> },
    { type: "SCOUT TEXT", icon: <FaA /> },
  ];
  return (
    <nav className="flex h-full border-l gap-0 border-brand relative top-[-1px]">
      {layouts.map((layout) => {
        const cls = classNames([
          tab === layout.type ? "text-text" : "text-accent",
          "leading-4",
          "border-brand",
          "px-4",
          "h-full",
          "text-sm",
          "border",
          "border-l-0",
          "flex",
          "gap-2",
          "items-center",
          tab === layout.type ? "border-t-bg" : "border-t-brand",
        ]);
        return (
          <button
            key={layout.type}
            className={cls}
            type="button"
            onClick={() => {
              setTab(layout.type);
            }}
          >
            {layout.icon}
            <span>{layout.type}</span>
          </button>
        );
      })}
    </nav>
  );
};

export { Stage };
