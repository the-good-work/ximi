import React, { useReducer } from "react";
import "./App.css";
import ListRooms from "ui/Screens/ListRooms";
import SelectConnectionMode from "ui/Screens/SelectConnectionMode";
import EnterPasscode from "ui/Screens/EnterPasscode";
import EnterName from "ui/Screens/EnterName";
import InSession from "ui/Screens/InSession";
import {
  ReducerStates,
  Room,
  RoomStateEnterName,
  RoomStateEnterPasscode,
  RoomStateInit,
  RoomStateInSession,
  RoomStateSelectConnectionInput,
  UpdateStateActions,
} from "../../../types/state";
import Container from "ui/Blocks/Container";

function App() {
  const rooms: Room[] = [
    { name: "asdf", id: "1", noOfParticipants: 1 },
    { name: "asdfasdsadf", id: "2", noOfParticipants: 10 },
    { name: "asdfasdsadf", id: "3", noOfParticipants: 10 },
    { name: "asdfasdsadf", id: "4", noOfParticipants: 10 },
    { name: "asdfasdsadf", id: "5", noOfParticipants: 10 },
    { name: "asdfasdsadf", id: "6", noOfParticipants: 10 },
    { name: "asdfasdsadf", id: "7", noOfParticipants: 10 },
    { name: "asdfasdsadf", id: "8", noOfParticipants: 10 },
    { name: "asdfasdsadf", id: "9", noOfParticipants: 10 },
    { name: "asdfasdsadf", id: "10", noOfParticipants: 10 },
    { name: "asdfasdsadf", id: "11", noOfParticipants: 10 },
    { name: "asdfasdsadf", id: "12", noOfParticipants: 10 },
  ];

  const initialState: RoomStateInit = {
    page: "list-room-page",
  };

  function reducer(_state: ReducerStates, action: UpdateStateActions) {
    if (
      action.type === "back-to-list" &&
      (_state.page === "in-session-page" ||
        _state.page === "select-connection-input-page")
    ) {
      const __state: RoomStateInit = {
        page: "list-room-page",
      };
      return __state;
    }
    if (
      action.type === "back-to-connection-input" &&
      (_state.page === "enter-passcode-page" ||
        _state.page === "enter-name-page")
    ) {
      const __state: RoomStateSelectConnectionInput = {
        page: "select-connection-input-page",
        properties: {
          room: _state.properties.room,
        },
      };
      return __state;
    } else if (
      action.type === "select-room" &&
      _state.page === "list-room-page"
    ) {
      const __state: RoomStateSelectConnectionInput = {
        page: "select-connection-input-page",
        properties: {
          room: action.properties.room,
        },
      };
      return __state;
    } else if (
      action.type === "select-connection-mode" &&
      _state.page === "select-connection-input-page"
    ) {
      const __state: RoomStateEnterPasscode = {
        page: "enter-passcode-page",
        properties: {
          room: _state.properties.room,
          inputType: action.properties.inputType,
        },
      };
      return __state;
    } else if (
      action.type === "submit-passcode" &&
      _state.page === "enter-passcode-page"
    ) {
      const __state: RoomStateEnterName = {
        page: "enter-name-page",
        properties: {
          room: _state.properties.room,
          inputType: _state.properties.inputType,
        },
      };
      return __state;
    } else if (
      action.type === "submit-name" &&
      _state.page === "enter-name-page"
    ) {
      const __state: RoomStateInSession = {
        page: "in-session-page",
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
  console.log(state);

  function PageRenderer({ state }: { state: ReducerStates }) {
    if (state.page === "list-room-page") {
      return <ListRooms rooms={rooms} updateState={updateState} />;
    } else if (state.page === "select-connection-input-page") {
      return <SelectConnectionMode updateState={updateState} />;
    } else if (state.page === "enter-passcode-page") {
      return <EnterPasscode updateState={updateState} />;
    } else if (state.page === "enter-name-page") {
      return <EnterName updateState={updateState} />;
    } else if (state.page === "in-session-page") {
      return <InSession updateState={updateState} />;
    } else return <></>;
  }
  return (
    <div id="App">
      <Container
        room={
          state.page !== "list-room-page"
            ? state.properties.room
              ? state.properties.room.name
              : "-"
            : "-"
        }
        isFullWidth={false}
      >
        <PageRenderer state={state} />
      </Container>
    </div>
  );
}

export default App;
