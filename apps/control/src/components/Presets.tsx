import React, { Dispatch } from "react";
import Text from "ui/Texts/Text";
import { styled } from "ui/theme/theme";
import { SaveSharp, Play } from "react-ionicons";
import IconButton from "ui/Buttons/IconButton";
import { Preset, PresetAction } from "../../../../types/stageStates";
import Input from "ui/Form/Input";

const StyledPresets = styled("div", {
  border: "2px solid $brand",
  width: "100%",
  height: "300px",
  background: "$background",
  overflow: "hidden",
  boxSizing: "border-box",
  padding: "$sm",
  display: "flex",
  flexDirection: "column",
  gap: "$2xs",
  ".presetsList": {
    overflowX: "hidden",
    overflowY: "scroll",
    display: "flex",
    flexDirection: "column",
    gap: "$2xs",
  },
});
const StyledPresetSingle = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "row",
  color: "$text",
  border: "1px solid $text",
  borderRadius: "$xs",
  ".name": {
    width: "100%",
    textTransform: "uppercase",

    padding: "$2xs $xs",
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
  setPresets,
}: {
  preset: Preset;
  setPresets: Dispatch<PresetAction>;
}) {
  return (
    <StyledPresetSingle>
      <div className="name">
        <Input
          maxLength="6"
          variant="presets"
          placeholder={preset.name}
          onBlur={(e: any) => {
            if (e.target.value.length > 0) {
              setPresets({
                type: "update-preset",
                name: e.target.value,
                saved: preset.saved,
                index: preset.index,
              });
            }
          }}
          css={{ color: preset.saved ? "$accent" : "$text" }}
        />
      </div>
      <div className="save">
        <IconButton
          onClick={() => {
            setPresets({
              type: "update-preset",
              name: preset.name,
              saved: true,
              index: preset.index,
            });
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
            console.log(`load ${preset.name}`);
          }}
          state={preset.saved ? "active" : "disabled"}
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
  presets,
  setPresets,
}: {
  presets: any[];
  setPresets: Dispatch<PresetAction>;
}) {
  return (
    <StyledPresets>
      <Text size="md" css={{ textTransform: "uppercase" }}>
        Presets
      </Text>
      <div className="presetsList">
        {presets.length > 0 ? (
          presets.map((_a, i) => {
            return (
              <PresetSingle
                preset={presets[i]}
                setPresets={setPresets}
                key={i}
              />
            );
          })
        ) : (
          <Text>No presets found</Text>
        )}
      </div>
    </StyledPresets>
  );
}
