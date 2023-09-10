import { useRoomInfo } from "@livekit/components-react";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { PresetIndex, SetPresetNameAction, XimiRoomState } from "types";
import * as Yup from "yup";

const renamePreset = async (
  roomName: string,
  n: PresetIndex,
  newName: string,
) => {
  const patch: SetPresetNameAction = {
    type: "set-preset-name",
    preset: n,
    name: newName,
    roomName: roomName,
  };
  const req = await fetch(
    `${import.meta.env.VITE_XIMI_SERVER_HOST}/room/state`,
    {
      method: "PATCH",
      body: JSON.stringify(patch),
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  const data = await req.json();
  return data;
};

const sanitizeNewName = (newName: string) => {
  return newName.replace(/[^a-zA-Z0-9]/g, "");
};

const PresetRenamer = () => {
  const meta = useRoomInfo();
  const [editing, setEditing] = useState(false);
  const newNameInputRef = useRef<HTMLInputElement>(null);

  // const setNewName = useCallback(async() =>, []);

  try {
    if (meta.metadata === undefined) {
      return <div>error</div>;
    }
    const roomState = JSON.parse(meta.metadata) as XimiRoomState;
    const activePresetName = roomState.presets[roomState.activePreset].name;
    return (
      <div className="relative top-[1px]">
        <input
          type="text"
          value={activePresetName}
          onClick={() => {
            if (newNameInputRef.current) {
              newNameInputRef.current.value = activePresetName;
              setEditing(true);
              setTimeout(() => {
                newNameInputRef.current?.focus();
              }, 100);
            }
          }}
          className={`w-48 h-8 p-1 text-left text-accent border bg-bg border-bg outline-none hover:border-brand hover:bg-brand/25 box-border ${
            editing ? "hidden" : "block"
          }`}
          readOnly={true}
        />

        <input
          type="text"
          id="new_preset_name"
          ref={newNameInputRef}
          placeholder={activePresetName}
          onBlur={async () => {
            const newName = sanitizeNewName(
              newNameInputRef.current?.value.toUpperCase() || "",
            );

            const result = await renamePreset(
              meta.name,
              roomState.activePreset,
              newName || activePresetName,
            );

            if (result.ok === true && !!newName) {
              toast(`Saved name ${newName}`, {
                position: "bottom-right",
                className: "bg-brand/80 text-text rounded-none",
              });
            }

            setEditing(false);
          }}
          onKeyUp={async (e) => {
            if (e.key === "Enter") {
              const newName = sanitizeNewName(
                newNameInputRef.current?.value.toUpperCase() || "",
              );

              await renamePreset(
                meta.name,
                roomState.activePreset,
                newName || activePresetName,
              );
              setEditing(false);
            }
          }}
          className={`w-48 h-8 p-1 text-left  border bg-bg border-brand box-border ${
            !editing ? "hidden" : "block"
          }`}
        />
      </div>
    );
  } catch (err) {
    return <div>Error</div>;
  }
};

export { PresetRenamer };
