import React, { Dispatch, SetStateAction } from "react";
import Heading from "ui/Texts/Heading";
import { styled } from "ui/theme/theme";
import { PanelStates } from "../../../../types/stageStates";

const StyledPanel = styled("div", {
  height: "100%",
  width: "100%",
  opacity: "0.5",
  border: "1px solid blue",
  borderRight: "none",
  color: "white",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

export default function StagePanel({
  activePanel,
  setActivePanel,
}: {
  activePanel: PanelStates;
  setActivePanel: Dispatch<SetStateAction<PanelStates>>;
}) {
  return (
    <StyledPanel>
      <Heading>Panel</Heading>
    </StyledPanel>
  );
}
