import { Participant } from "livekit-client";
import React, { Dispatch, SetStateAction } from "react";
import { Sad } from "react-ionicons";
import Heading from "ui/Texts/Heading";
import Text from "ui/Texts/Text";
import { styled } from "ui/theme/theme";
import { PanelStates } from "../../../../types/stageStates";
import AudioMixCard from "./AudioMixCard";

import { Root, Viewport, Scrollbar } from "@radix-ui/react-scroll-area";

const StyledPanel = styled("div", {
  height: "100%",
  width: "100%",
  color: "white",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
  gridGap: "$md",
  boxSizing: "border-box",
  paddingRight: "$lg",
});

const StyledEmptyState = styled("div", {
  height: "100%",
  width: "100%",
  color: "white",
  display: "flex",
  opacity: "0.8",
  gap: "$sm",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  ".icon": {
    path: {
      fill: "$text",
    },
  },
});

const StyledRoot = styled(Root, {
  height: "100%",
  width: "100%",
  overflow: "hidden",
});

const StyledViewport = styled(Viewport, {
  height: "100%",
  width: "100%",
});

export default function StagePanel({
  activePanel,
  setActivePanel,
  participants,
}: {
  activePanel: PanelStates;
  setActivePanel: Dispatch<SetStateAction<PanelStates>>;
  participants: Participant[];
}) {
  if (activePanel === "audio") {
    if (participants.length <= 0) {
      return (
        <StyledEmptyState>
          <div className="icon" aria-hidden="true">
            <Sad width="32px" height="32px" />
          </div>
          <Text>There is no one in this room</Text>
        </StyledEmptyState>
      );
    } else
      return (
        <StyledRoot>
          <StyledViewport>
            <StyledPanel>
              {participants.map((p: any) => {
                return (
                  <AudioMixCard
                    type={JSON.parse(p.metadata).type.toLowerCase()}
                    participant={p}
                    participants={participants}
                  />
                );
              })}
            </StyledPanel>
          </StyledViewport>
          <Scrollbar orientation="vertical" />
        </StyledRoot>
      );
  } else
    return (
      <StyledPanel>
        <Heading>Video Panel</Heading>
      </StyledPanel>
    );
}
