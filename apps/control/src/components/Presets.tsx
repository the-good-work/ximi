import React, { useEffect, useState } from "react";
import { styled } from "ui/theme/theme";
import { SaveSharp, Play, Trash } from "react-ionicons";
import IconButton from "ui/Buttons/IconButton";
import Text from "ui/Texts/Text";
import { Preset } from "@thegoodwork/ximi-types";
import Input from "ui/Form/Input";
import { Root, Viewport, Scrollbar } from "@radix-ui/react-scroll-area";
import { RoomUpdatePayload } from "@thegoodwork/ximi-types/src/room";
import { Room } from "livekit-client";
import hash from "object-hash";

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
  height: "calc(100vh - 150px - 9.75rem)",
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
    borderLeft: "1px solid $grey",
    position: "relative",
  },
  ".load": {
    borderLeft: "1px solid $grey",
    color: "$text",
  },
  ".clear": {
    borderLeft: "1px solid $grey",
  },

  variants: {
    active: {
      true: {
        background: `$brandTransparent`,
        border: "2px solid $brand",
      },
    },
  },
});

function PresetSingle({
  preset,
  touched,
  onSave,
  onLoad,
  onClear,
  active,
}: {
  preset: Preset;
  touched: boolean;
  onSave: (name?: string) => Promise<void>;
  onLoad: () => void;
  onClear: () => void;
  active: boolean;
}) {
  const [_name, setName] = useState(preset.name);

  useEffect(() => {
    setName(() => preset.name);
  }, [preset, preset.name]);

  return (
    <StyledPresetSingle active={active}>
      <div className="name">
        <Input
          maxLength="6"
          variant="presets"
          value={_name || `SLOT${preset.index + 1}`}
          placeholder={`SLOT${preset.index + 1}`}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setName(e.target.value);
          }}
          onBlur={() => {
            onSave(_name || `SLOT${preset.index + 1}`);
          }}
          css={{
            fontSize: "$2xs",
            background: "transparent",
            borderRadius: "$xs 0 0 $xs",
            appearance: "none",
            width: "100%",
            height: "100%",
            boxSizing: "border-box",
            color: "$text",
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
            onSave(_name || `SLOT${preset.index + 1}`);
          }}
          css={{ borderRadius: "0" }}
          state={active && touched ? "active" : "default"}
          variant="ghost"
          iconSize="sm"
          icon={<SaveSharp />}
        />
        {active && touched ? <DirtyDot /> : null}
      </div>
      <div className="load">
        <IconButton
          onClick={() => {
            if (touched) {
              const confirm = window.confirm(
                "Unsaved changes present. Confirm load?"
              );
              if (confirm) {
                onLoad();
              }
            } else {
              onLoad();
            }
          }}
          state={preset?.participants?.length ? "default" : "disabled"}
          css={{ borderRadius: "0" }}
          variant="ghost"
          iconSize="sm"
          icon={<Play />}
        />
      </div>
      <div className="clear">
        <IconButton
          onClick={() => onClear()}
          state={preset?.participants?.length ? "default" : "disabled"}
          css={{ borderRadius: "0 $xs $xs 0" }}
          variant="ghost"
          iconSize="sm"
          icon={<Trash />}
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
  const [presetTouched, setPresetTouched] = useState<boolean>(false);
  useEffect(() => {
    if (!stageSettings.participants) {
      return;
    }
    const pNow = [...stageSettings.participants];
    const pPreset = [
      ...(stageSettings.presets.find(
        (preset, i) =>
          preset.name === stageSettings.currentPreset ||
          `SLOT${i + 1}` === stageSettings.currentPreset
      )?.participants || []),
    ];
    setPresetTouched(() => hash(pNow) !== hash(pPreset));
  }, [room, stageSettings]);

  if (!room) {
    return <></>;
  }

  return (
    <StyledPresets>
      <Text
        size="xs"
        css={{ textTransform: "uppercase", padding: ".5em 0", lineHeight: 1 }}
      >
        Presets
        <br />
        <Text size="2xs" css={{ color: "$grey", lineHeight: "1" }}>
          {presetTouched ? "Unsaved changes" : <>&nbsp;</>}
        </Text>
      </Text>

      <StyledRoot>
        <StyledViewport>
          <div className="presetsList">
            {stageSettings.presets.length > 0 ? (
              stageSettings.presets.map((_preset, i) => {
                return (
                  <PresetSingle
                    preset={stageSettings.presets[i]}
                    touched={presetTouched}
                    active={
                      (stageSettings.currentPreset === _preset.name ||
                        stageSettings.currentPreset === `SLOT${i + 1}`) &&
                      stageSettings.currentPreset !== ""
                    }
                    onClear={async () => {
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
                      const isActiveSlot =
                        (stageSettings.currentPreset === _preset.name ||
                          stageSettings.currentPreset === `SLOT${i + 1}`) &&
                        stageSettings.currentPreset !== "";
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
                      if (isActiveSlot) {
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
                      }
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

const DirtyDot = styled(
  "b",

  {
    position: "absolute",
    background: "$accent",
    width: "5px",
    height: "5px",
    top: "4px",
    right: "4px",
  }
);
