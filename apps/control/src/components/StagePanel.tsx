import { Participant } from "livekit-client";
import React from "react";
import { Sad } from "react-ionicons";
import Text from "ui/Texts/Text";
import { styled } from "ui/theme/theme";
import { PanelStates } from "../../../../types/stageStates";
import AudioMixCard from "./AudioMixCard";

import { Root, Viewport, Scrollbar } from "@radix-ui/react-scroll-area";
import VideoPanel from "./VideoPanel";

const StyledAudioPanel = styled("div", {
  height: "100%",
  width: "100%",
  color: "white",
  gridGap: "$md",
  boxSizing: "border-box",
  paddingRight: "$lg",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
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
  participants,
  roomName,
}: {
  activePanel: PanelStates;
  participants: Participant[];
  roomName: string;
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
            <StyledAudioPanel>
              {participants.map((p: any) => {
                return (
                  <AudioMixCard
                    roomName={roomName}
                    type={JSON.parse(p.metadata).type.toLowerCase()}
                    participant={p}
                    participants={participants}
                  />
                );
              })}
            </StyledAudioPanel>
          </StyledViewport>
          <Scrollbar orientation="vertical" />
        </StyledRoot>
      );
  } else
    return (
      <StyledRoot>
        <StyledViewport>
          <VideoPanel
            participants={participants}
            currentParticipant={
              participants.length >= 2 ? participants[1] : participants[0]
            }
          />
        </StyledViewport>
        <Scrollbar orientation="vertical" />
      </StyledRoot>
    );
}
