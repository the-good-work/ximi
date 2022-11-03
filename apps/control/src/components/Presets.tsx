import React from "react";
import Heading from "ui/Texts/Heading";
import { styled } from "ui/theme/theme";

const StyledPresets = styled("div", {
  border: "2px solid $brand",
  width: "192px",
  height: "200px",
  background: "$background",
});

export default function Presets() {
  return <StyledPresets>Presets</StyledPresets>;
}
