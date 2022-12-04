import React, { useReducer, useState } from "react";
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
import JoinRoom from "./screens/JoinRoom";
import Container from "ui/Blocks/Container";
import Stage from "./screens/Stage";
import CreateRoom from "./screens/CreateRoom";

const initialState: RoomStateInit = {
  screen: "room-list-screen",
};

function reducer(_state: ReducerStates, action: UpdateStateActions) {
  if (action.type === "back-to-list" && _state.screen !== "room-list-screen") {
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
    const _s = _state;

    if (!_s.room) {
      return _state;
    }

    const __state: RoomStateStage = {
      screen: "stage-screen",
      room: {
        room: _s.room.room,
        participants: _s.room.participants,
        passcode: action.passcode,
      },
      token: action.token,
    };
    return __state;
  } else if (
    action.type === "set-control-name" &&
    _state.screen === "stage-screen"
  ) {
    if (_state.controlName === action.name) {
      return _state;
    }
    const __state: RoomStateStage = { ..._state, controlName: action.name };
    return __state;
  } else {
    return initialState;
  }
}

function App() {
  const [state, updateState] = useReducer(reducer, initialState);

  function RenderScreen({ state }: { state: ReducerStates }) {
    if (state.screen === "room-list-screen") {
      return <RoomsList updateState={updateState} />;
    } else if (state.screen === "join-room-screen") {
      return <JoinRoom state={state} updateState={updateState} />;
    } else if (state.screen === "create-room-screen") {
      return <CreateRoom updateState={updateState} />;
    } else if (state.screen === "stage-screen") {
      return <Stage state={state} updateState={updateState} />;
    } else return <></>;
  }

  return (
    <div className="App">
      <Container
        participantName={
          state.screen === "stage-screen" ? state.controlName : "-"
        }
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
