import React, { Dispatch, useEffect, useState, useReducer } from "react";
import StageSidebar from "../components/StageSidebar";
import {
  RoomStateStage,
  UpdateStateActions,
} from "../../../../types/controlStates";
import {
  PanelStates,
  Preset,
  PresetAction,
} from "../../../../types/stageStates";
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
  const initialState = Array.apply(null, Array(12)).map((_a, i) => {
    return {
      name: `SLOT${i < 9 ? `0${i + 1}` : i + 1}`,
      saved: false,
      index: i,
    };
  });
  const { connect, room, error, participants } = useRoom();
  const [presets, setPresets] = useReducer(reducer, initialState);
  const [activePanel, setActivePanel] = useState<PanelStates>("audio");

  function reducer(_state: Preset[], action: PresetAction) {
    if (action.type === "update-preset") {
      const updatedPreset = {
        name: action.name,
        saved: action.saved,
        index: action.index,
      };
      _state.splice(action.index, 1, updatedPreset);
      const __state = _state.slice();
      return __state;
    } else return initialState;
  }

  async function connectRoom() {
    await connect(`${process.env.REACT_APP_LIVEKIT_HOST}`, state.token);
  }

  useEffect(() => {
    connectRoom().catch((err) => {
      console.log(err);
    });
  }, []);

  useEffect(() => {
    if (room) {
      if (room.localParticipant) {
        console.log(room, participants);

        // set name of current control node as room.localParticipant.identity
      }
    }
  }, [room]);

  if (error) {
    console.log(error);
  }

  return (
    <div className="content noscroll">
      <StyledStage>
        <StagePanel
          activePanel={activePanel}
          setActivePanel={setActivePanel}
          participants={participants}
        />
        <StageSidebar
          presets={presets}
          setPresets={setPresets}
          updateState={updateState}
          activePanel={activePanel}
          setActivePanel={setActivePanel}
        />
      </StyledStage>
    </div>
  );
}
