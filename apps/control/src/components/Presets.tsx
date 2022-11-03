import React from "react";
import Text from "ui/Texts/Text";
import { styled } from "ui/theme/theme";
import { SaveSharp, Play } from "react-ionicons";
import IconButton from "ui/Buttons/IconButton";

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

function PresetSingle() {
  return (
    <StyledPresetSingle>
      <div className="name">
        <Text>Pres1</Text>
      </div>
      <div className="save">
        <IconButton
          css={{ borderRadius: "0" }}
          variant="ghost"
          iconSize="sm"
          icon={<SaveSharp />}
        />
      </div>
      <div className="load">
        <IconButton
          state={"active"}
          css={{ borderRadius: "0 $xs $xs 0" }}
          variant="ghost"
          iconSize="sm"
          icon={<Play />}
        />
      </div>
    </StyledPresetSingle>
  );
}

export default function Presets() {
  return (
    <StyledPresets>
      <Text size="md" css={{ textTransform: "uppercase" }}>
        Presets
      </Text>
      <div className="presetsList">
        {Array.apply(null, Array(10)).map((_a, i) => {
          return <PresetSingle key={i} />;
        })}
      </div>
    </StyledPresets>
  );
}
