import React, { useReducer } from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  ReducerStates,
  RoomStateCreate,
  RoomStateInit,
  RoomStateJoin,
  RoomStateStage,
  UpdateStateActions,
} from "../../../types/controlStates";
import RoomsList from "./screens/RoomsList";
import Container from "ui/Blocks/Container";

function App() {
  const initialState: RoomStateInit = {
    screen: "room-list-screen",
  };

  function reducer(_state: ReducerStates, action: UpdateStateActions) {
    if (
      action.type === "back-to-list" &&
      _state.screen !== "room-list-screen"
    ) {
      const __state: RoomStateInit = {
        screen: "room-list-screen",
      };
      return __state;
    }
    if (action.type === "create-room" && _state.screen === "room-list-screen") {
      const __state: RoomStateCreate = {
        screen: "create-room-screen",
      };
      return __state;
    }
    if (
      action.type === "confirm-create-room" &&
      _state.screen === "create-room-screen"
    ) {
      const __state: RoomStateStage = {
        screen: "stage-screen",
        room: action.room,
        token: action.token,
      };
      return __state;
    }
    if (action.type === "select-room" && _state.screen === "room-list-screen") {
      const __state: RoomStateJoin = {
        screen: "join-room-screen",
        room: action.room,
      };
      return __state;
    }
    if (
      action.type === "submit-passcode" &&
      _state.screen === "join-room-screen"
    ) {
      const __state: RoomStateStage = {
        screen: "stage-screen",
        room: _state.room,
        token: action.token,
      };
      return __state;
    } else return initialState;
  }

  const [state, updateState] = useReducer(reducer, initialState);

  console.log(state);

  function RenderScreen({ state }: { state: ReducerStates }) {
    if (state.screen === "room-list-screen") {
      return <RoomsList updateState={updateState} />;
    } else return <></>;
  }

  return (
    <div className="App">
      <Container
        variant="control"
        room={
          state.screen !== "room-list-screen" &&
          state.screen !== "create-room-screen"
            ? state?.room
              ? state?.room.room
              : "-"
            : "-"
        }
        isFullWidth={false}
      >
        <RenderScreen state={state} />
      </Container>
    </div>
  );
}

export default App;
