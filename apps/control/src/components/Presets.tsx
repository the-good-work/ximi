import React, { Dispatch } from "react";
import Text from "ui/Texts/Text";
import { styled } from "ui/theme/theme";
import { SaveSharp, Play } from "react-ionicons";
import IconButton from "ui/Buttons/IconButton";
import { Preset, PresetAction } from "../../../../types/stageStates";
import Input from "ui/Form/Input";
import { Root, Viewport, Scrollbar } from "@radix-ui/react-scroll-area";

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
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "row",
  color: "$text",
  border: "1px solid $text",
  borderRadius: "$xs",
  ".name": {
    width: "100%",
    textTransform: "uppercase",
    padding: "$2xs $xs $2xs $2xs",
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
          css={{ fontSize: "$2xs", color: preset.saved ? "$accent" : "$text" }}
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
      <Text size="xs" css={{ textTransform: "uppercase" }}>
        Presets
      </Text>
      <StyledRoot>
        <StyledViewport>
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
              <Text size="xs">No presets found</Text>
            )}
          </div>
        </StyledViewport>
        <Scrollbar orientation="vertical" />
      </StyledRoot>
    </StyledPresets>
  );
}
