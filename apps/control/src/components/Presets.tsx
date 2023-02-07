import React, { useEffect, useState } from "react";
import { styled } from "ui/theme/theme";
import { SaveSharp, Play, Trash, Download, CloudUpload } from "react-ionicons";
import IconButton from "ui/Buttons/IconButton";
import Text from "ui/Texts/Text";
import { Participant, Preset } from "@thegoodwork/ximi-types";
import Input from "ui/Form/Input";
import { Root, Viewport, Scrollbar } from "@radix-ui/react-scroll-area";
import { RoomUpdatePayload } from "@thegoodwork/ximi-types/src/room";
import { Room } from "livekit-client";
import hash from "object-hash";
import { useToast } from "ui/Feedback/Toast";

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
  textAlign: "left",

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
          value={_name}
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
      {active && (
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
      )}
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
    const pNow = [...stageSettings.participants].filter(
      (p) => p.type === "PERFORMER"
    );
    const pPreset = [
      ...((stageSettings.presets.find(
        (preset, i) =>
          preset.name === stageSettings.currentPreset ||
          `SLOT${i + 1}` === stageSettings.currentPreset
      )?.participants as Participant[]) || []),
    ].filter((p) => p.type === "PERFORMER");

    setPresetTouched(
      () => hash(pNow) !== hash(pPreset) && stageSettings.currentPreset !== ""
    );
  }, [room, stageSettings]);

  const { toast } = useToast();

  if (!room) {
    return <></>;
  }

  return (
    <StyledPresets>
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Text
          size="xs"
          css={{
            textTransform: "uppercase",
            padding: ".5em 0",
            lineHeight: 1,
            position: "relative",
            display: "block",
          }}
        >
          Presets{" "}
          {presetTouched ? (
            <span
              style={{
                fontSize: "30px",
                lineHeight: "1",
                display: "block",
                position: "absolute",
                left: "calc(100% + .1em)",
                top: "20%",
                color: "$brand",
              }}
            >
              *
            </span>
          ) : (
            <>&nbsp;</>
          )}
        </Text>
        <div>
          <IconButton
            css={{ border: "none" }}
            icon={<Download />}
            iconSize="sm"
            onClick={() => {
              const payload = {
                ...stageSettings,
                participants: stageSettings.participants
                  ? stageSettings.participants.filter(
                      (p) => p.type !== "CONTROL"
                    )
                  : [],
              };
              var dataStr =
                "data:text/json;charset=utf-8," +
                encodeURIComponent(JSON.stringify(payload));

              var anchor = document.createElement("a");
              anchor.setAttribute("href", dataStr);
              anchor.setAttribute("download", `presets-${room.name}.json`);
              anchor.click();
            }}
          />
          <IconButton
            css={{ border: "none" }}
            icon={<CloudUpload />}
            iconSize="sm"
            onClick={() => {
              const inputDom = document.getElementById("preset-file-upload");
              inputDom?.click();
            }}
          />
        </div>
        <input
          id="preset-file-upload"
          type="file"
          accept="application/json"
          multiple={false}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (!f) {
              return;
            }

            f.text().then((text) => {
              try {
                const loadedPresetFile = JSON.parse(text);

                const presets = loadedPresetFile.presets;

                if (presets.length !== 12) {
                  throw new Error("Preset file corrupted");
                }

                fetch(`${process.env.REACT_APP_SERVER_HOST}/room/edit-preset`, {
                  method: "PATCH",
                  body: JSON.stringify({
                    type: "LOAD_PRESET_FILE",
                    room_name: room.name,
                    presets: presets,
                  }),
                  headers: {
                    "Content-Type": "application/json",
                  },
                }).then(() => {
                  toast({
                    title: "Presets loaded from file",
                    tone: "default",
                  });
                });
              } catch (err) {
                console.log(err);
                toast({
                  title: "Error loading preset",
                  description: "The file uploaded might be corrupted",
                  tone: "warning",
                });
              }
            });
          }}
          style={{ position: "absolute", left: "-10000em" }}
        />
      </div>

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
                            type: "SAVE_PRESET",
                            room_name: room.name,
                            preset: {
                              index: i,
                              name: _preset.name,
                              participants:
                                _preset.participants === undefined
                                  ? []
                                  : _preset.participants.map((p) => ({
                                      ...p,
                                      audioMixMute: [],
                                      audioOutDelay: 0,
                                      video: { slots: [], layout: "Default" },
                                    })),
                            },
                          }),
                          headers: {
                            "Content-Type": "application/json",
                          },
                        }
                      );

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
                              participants:
                                stageSettings.participants?.filter(
                                  (p) => p.type === "PERFORMER"
                                ) || [],
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
