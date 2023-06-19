import React, { useReducer } from "react";
import "./App.css";
import RoomsList from "./screens/RoomsList";
import SelectConnectionMode from "./screens/SelectConnectionMode";
import EnterPasscode from "./screens/EnterPasscode";
import EnterName from "./screens/EnterName";
import Stage from "./screens/Stage";
import {
  ReducerStates,
  RoomStateEnterName,
  RoomStateEnterPasscode,
  RoomStateInit,
  RoomStateStage,
  RoomStateSelectConnectionInput,
  UpdateStateActions,
} from "../../../types/performerStates";
import Container from "ui/Blocks/Container";

const initialState: RoomStateInit = {
  screen: "room-list-screen",
};

function reducer(_state: ReducerStates, action: UpdateStateActions) {
  if (
    action.type === "back-to-list" &&
    (_state.screen === "stage-screen" ||
      _state.screen === "select-connection-input-screen")
  ) {
    const __state: RoomStateInit = {
      screen: "room-list-screen",
    };
    return __state;
  }
  if (
    action.type === "back-to-connection-input" &&
    _state.screen === "enter-name-screen"
  ) {
    const __state: RoomStateSelectConnectionInput = {
      screen: "select-connection-input-screen",
      properties: {
        room: _state.properties.room,
      },
    };
    return __state;
  }
  if (
    action.type === "back-to-enter-name" &&
    _state.screen === "enter-passcode-screen"
  ) {
    const __state: RoomStateEnterName = {
      screen: "enter-name-screen",
      properties: {
        room: _state.properties.room,
        inputType: _state.properties.inputType,
        name: _state.properties.name,
        // name: action.properties.name,
      },
    };
    return __state;
  }
  if (action.type === "select-room" && _state.screen === "room-list-screen") {
    const __state: RoomStateSelectConnectionInput = {
      screen: "select-connection-input-screen",
      properties: {
        room: action.properties.room,
      },
    };
    return __state;
  }
  if (
    action.type === "select-connection-mode" &&
    _state.screen === "select-connection-input-screen"
  ) {
    const __state: RoomStateEnterName = {
      screen: "enter-name-screen",
      properties: {
        room: _state.properties.room,
        inputType: action.properties.inputType,
        name: "",
      },
    };
    return __state;
  }
  if (action.type === "submit-name" && _state.screen === "enter-name-screen") {
    const __state: RoomStateEnterPasscode = {
      screen: "enter-passcode-screen",
      properties: {
        name: action.properties.name,
        room: _state.properties.room,
        inputType: _state.properties.inputType,
      },
    };
    return __state;
  }
  if (
    action.type === "submit-passcode" &&
    _state.screen === "enter-passcode-screen"
  ) {
    const __state: RoomStateStage = {
      screen: "stage-screen",
      properties: {
        room: _state.properties.room,
        inputType: _state.properties.inputType,
        name: _state.properties.name,
        token: action.properties.token,
      },
    };
    return __state;
  } else {
    return initialState;
  }
}

function App() {
  const [state, updateState] = useReducer(reducer, initialState);

  function ScreenRenderer({ state }: { state: ReducerStates }) {
    if (state.screen === "room-list-screen") {
      return <RoomsList updateState={updateState} />;
    } else if (state.screen === "select-connection-input-screen") {
      return <SelectConnectionMode updateState={updateState} />;
    } else if (state.screen === "enter-passcode-screen") {
      return <EnterPasscode state={state} updateState={updateState} />;
    } else if (state.screen === "enter-name-screen") {
      return <EnterName state={state} updateState={updateState} />;
    } else if (state.screen === "stage-screen") {
      return <Stage state={state} updateState={updateState} />;
    } else return <></>;
  }
  return (
    <div id="App">
      <Container
        participantName={((s) => {
          if (
            s.screen === "stage-screen" ||
            s.screen === "enter-passcode-screen"
          ) {
            return s.properties.name;
          }
        })(state)}
        variant="performer"
        room={
          state.screen !== "room-list-screen"
            ? state.properties.room
              ? state.properties.room.room
              : "-"
            : "-"
        }
        isFullWidth={state.screen === "stage-screen" ? true : false}
      >
        <ScreenRenderer state={state} />
      </Container>
    </div>
  );
}

export default App;
