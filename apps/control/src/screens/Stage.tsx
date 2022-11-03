import React, { Dispatch, useEffect, useState } from "react";
import IconButton from "ui/Buttons/IconButton";
import { ReturnDownBack } from "react-ionicons";
import StageSidebar from "../components/StageSidebar";
import {
  PanelStates,
  RoomStateStage,
  UpdateStateActions,
} from "../../../../types/controlStates";
import { useRoom } from "@livekit/react-core";
import { styled } from "ui/theme/theme";
import StagePanel from "../components/StagePanel";

const StyledStage = styled("div", {
  display: "flex",
  width: "100%",
  height: "100%",
  justifyContent: "space-between",
  alignItems: "center",
  flexDirection: "row",
});

export default function Stage({
  state,
  updateState,
}: {
  updateState: Dispatch<UpdateStateActions>;
  state: RoomStateStage;
}) {
  const { connect, room, error, participants } = useRoom();
  const [activePanel, setActivePanel] = useState<PanelStates>("audio");

  async function connectRoom() {
    await connect(`${process.env.REACT_APP_LIVEKIT_HOST}`, state.token);
  }

  useEffect(() => {
    connectRoom().catch((err) => {
      console.log(err);
    });
  }, []);

  if (error) {
    console.log(error);
  }
  console.log(room, participants);

  return (
    <div className="content noscroll">
      <StyledStage>
        <StagePanel activePanel={activePanel} setActivePanel={setActivePanel} />
        <StageSidebar
          updateState={updateState}
          activePanel={activePanel}
          setActivePanel={setActivePanel}
        />
      </StyledStage>
    </div>
  );
}
