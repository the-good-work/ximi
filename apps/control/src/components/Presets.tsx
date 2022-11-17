import React, { FocusEventHandler, useEffect, useState } from "react";
import { styled } from "ui/theme/theme";
import { SaveSharp, Play } from "react-ionicons";
import IconButton from "ui/Buttons/IconButton";
import Text from "ui/Texts/Text";
import { Preset } from "@thegoodwork/ximi-types";
import Input from "ui/Form/Input";
import { Root, Viewport, Scrollbar } from "@radix-ui/react-scroll-area";
import { RoomUpdatePayload } from "@thegoodwork/ximi-types/src/room";
import { Room } from "livekit-client";

const StyledRoot = styled(Root, {
  height: "100%",
  width: "100%",
  overflow: "hidden",
});

const StyledViewport = styled(Viewport, {
  height: "100%",
  width: "100%",
});

const StyledPresets = styled("div", {
  border: "2px solid $brand",
  width: "100%",
  height: "calc(100vh - 190px - 9.75rem)",
  background: "$background",
  overflow: "hidden",
  boxSizing: "border-box",
  padding: "$xs $sm",
  display: "flex",
  flexDirection: "column",
  gap: "$2xs",
  ".presetsList": {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "$2xs",
  },
});
const StyledPresetSingle = styled("div", {
  display: "flex",
  alignItems: "stretch",
  justifyContent: "center",
  flexDirection: "row",
  color: "$text",
  border: "1px solid $text",
  borderRadius: "$xs",

  ".name": {
    display: "block",
    padding: 0,
    width: "100%",
    textTransform: "uppercase",

    // padding: "$2xs $xs $2xs $2xs",
  },
  ".save": {
    borderLeft: "1px solid $text",
    borderRight: "1px solid $text",
  },
  ".load": {
    color: "$text",
  },
});

function PresetSingle({
  preset,
  onSave,
  onLoad,
}: {
  preset: Preset;
  onSave: (name?: string) => Promise<void>;
  onLoad: () => void;
}) {
  const [_name, setName] = useState(preset.name);

  useEffect(() => {
    setName(() => preset.name);
  }, [preset, preset.name]);

  return (
    <StyledPresetSingle>
      <div className="name">
        <Input
          maxLength="6"
          variant="presets"
          value={_name}
          placeholder={`SLOT${preset.index + 1}`}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setName(e.target.value);
          }}
          onBlur={() => {
            onSave(_name);
          }}
          css={{
            fontSize: "$2xs",
            borderRadius: "$xs 0 0 $xs",
            appearance: "none",
            width: "100%",
            height: "100%",
            boxSizing: "border-box",
            color: "$text",
            //color: preset?.participants?.length ? "$accent" : "$text",
            border: "none",
            outline: "none",
            position: "relative",
            display: "block",
          }}
        />
      </div>
      <div className="save">
        <IconButton
          onClick={() => {
            onSave(_name);
          }}
          css={{ borderRadius: "0" }}
          variant="ghost"
          iconSize="sm"
          icon={<SaveSharp />}
        />
      </div>
      <div className="load">
        <IconButton
          onClick={() => {
            onLoad();
          }}
          state={preset?.participants?.length ? "active" : "disabled"}
          css={{ borderRadius: "0 $xs $xs 0" }}
          variant="ghost"
          iconSize="sm"
          icon={<Play />}
        />
      </div>
    </StyledPresetSingle>
  );
}

export default function Presets({
  stageSettings,
  room,
}: {
  stageSettings: RoomUpdatePayload["update"];
  room?: Room;
}) {
  if (!room) {
    return <></>;
  }
  return (
    <StyledPresets>
      <Text size="xs" css={{ textTransform: "uppercase" }}>
        Presets
      </Text>
      <StyledRoot>
        <StyledViewport>
          <div className="presetsList">
            {stageSettings.presets.length > 0 ? (
              stageSettings.presets.map((_preset, i) => {
                return (
                  <PresetSingle
                    preset={stageSettings.presets[i]}
                    onLoad={async () => {
                      await fetch(
                        `${process.env.REACT_APP_SERVER_HOST}/room/edit-preset`,
                        {
                          method: "PATCH",
                          body: JSON.stringify({
                            type: "LOAD_PRESET",
                            room_name: room.name,
                            index: i,
                          }),
                          headers: {
                            "Content-Type": "application/json",
                          },
                        }
                      );
                    }}
                    onSave={async (name?: string) => {
                      await fetch(
                        `${process.env.REACT_APP_SERVER_HOST}/room/edit-preset`,
                        {
                          method: "PATCH",
                          body: JSON.stringify({
                            type: "SAVE_PRESET",
                            room_name: room.name,
                            preset: {
                              index: i,
                              name: name || _preset.name,
                              participants: stageSettings.participants || [],
                            },
                          }),
                          headers: {
                            "Content-Type": "application/json",
                          },
                        }
                      );
                    }}
                    key={i}
                  />
                );
              })
            ) : (
              <Text size="xs">No presets found</Text>
            )}
          </div>
        </StyledViewport>
        <Scrollbar orientation="vertical" />
      </StyledRoot>
    </StyledPresets>
  );
}
