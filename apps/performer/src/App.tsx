import React, { useReducer } from "react";
import "./App.css";
import ListRooms from "ui/Screens/ListRooms";
import SelectConnectionMode from "ui/Screens/SelectConnectionMode";
import EnterPasscode from "ui/Screens/EnterPasscode";
import EnterName from "ui/Screens/EnterName";
import InSession from "ui/Screens/InSession";
import {
  ReducerStates,
  RoomStateEnterName,
  RoomStateEnterPasscode,
  RoomStateInit,
  RoomStateInSession,
  RoomStateSelectConnectionInput,
  UpdateStateActions,
} from "../../../types/state";
import Container from "ui/Blocks/Container";

function App() {
  const initialState: RoomStateInit = {
    screen: "list-room-screen",
  };

  function reducer(_state: ReducerStates, action: UpdateStateActions) {
    if (
      action.type === "back-to-list" &&
      (_state.screen === "in-session-screen" ||
        _state.screen === "select-connection-input-screen")
    ) {
      const __state: RoomStateInit = {
        screen: "list-room-screen",
      };
      return __state;
    }
    if (
      action.type === "back-to-connection-input" &&
      (_state.screen === "enter-passcode-screen" ||
        _state.screen === "enter-name-screen")
    ) {
      const __state: RoomStateSelectConnectionInput = {
        screen: "select-connection-input-screen",
        properties: {
          room: _state.properties.room,
        },
      };
      return __state;
    } else if (
      action.type === "select-room" &&
      _state.screen === "list-room-screen"
    ) {
      const __state: RoomStateSelectConnectionInput = {
        screen: "select-connection-input-screen",
        properties: {
          room: action.properties.room,
        },
      };
      return __state;
    } else if (
      action.type === "select-connection-mode" &&
      _state.screen === "select-connection-input-screen"
    ) {
      const __state: RoomStateEnterPasscode = {
        screen: "enter-passcode-screen",
        properties: {
          room: _state.properties.room,
          inputType: action.properties.inputType,
        },
      };
      return __state;
    } else if (
      action.type === "submit-passcode" &&
      _state.screen === "enter-passcode-screen"
    ) {
      const __state: RoomStateEnterName = {
        screen: "enter-name-screen",
        properties: {
          room: _state.properties.room,
          inputType: _state.properties.inputType,
        },
      };
      return __state;
    } else if (
      action.type === "submit-name" &&
      _state.screen === "enter-name-screen"
    ) {
      const __state: RoomStateInSession = {
        screen: "in-session-screen",
        properties: {
          room: _state.properties.room,
          inputType: _state.properties.inputType,
        },
      };
      return __state;
    } else {
      return initialState;
    }
  }

  const [state, updateState] = useReducer(reducer, initialState);

  function ScreenRenderer({ state }: { state: ReducerStates }) {
    if (state.screen === "list-room-screen") {
      return <ListRooms updateState={updateState} />;
    } else if (state.screen === "select-connection-input-screen") {
      return <SelectConnectionMode updateState={updateState} />;
    } else if (state.screen === "enter-passcode-screen") {
      return <EnterPasscode updateState={updateState} />;
    } else if (state.screen === "enter-name-screen") {
      return <EnterName updateState={updateState} />;
    } else if (state.screen === "in-session-screen") {
      return <InSession updateState={updateState} />;
    } else return <></>;
  }
  return (
    <div id="App">
      <Container
        room={
          state.screen !== "list-room-screen"
            ? state.properties.room
              ? state.properties.room.room
              : "-"
            : "-"
        }
        isFullWidth={false}
      >
        <ScreenRenderer state={state} />
      </Container>
    </div>
  );
}

export default App;
