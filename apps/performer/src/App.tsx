import React, { useReducer } from "react";
import "./App.css";
import Home from "ui/Screens/Home";
import SelectInput from "ui/Screens/SelectInput";
import {
  ReducerStates,
  RoomStateEnterPassword,
  RoomStateInit,
  RoomStateSelectInput,
  UpdateStateActions,
} from "../../../types/state";
import Container from "ui/Blocks/Container";

function App() {
  const rooms = [
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
    page: "home",
    properties: {
      room: null,
      rooms: rooms,
    },
  };

  function reducer(_state: ReducerStates, action: UpdateStateActions) {
    if (action.type === "go-home") {
      const __state: RoomStateInit = {
        page: "home",
        properties: {
          room: null,
          rooms: rooms,
        },
      };
      return __state;
    } else if (action.type === "room-selected") {
      const __state: RoomStateSelectInput = {
        page: "select-input",
        properties: {
          room: action.properties.room,
        },
      };
      return __state;
    } else if (action.type === "connection-mode-selected") {
      const __state: RoomStateEnterPassword = {
        page: "enter-password",
        properties: {
          room: _state.properties.room,
          inputType: action.properties.inputType,
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
    if (state.page === "home") {
      return <Home state={state} updateState={updateState} />;
    } else if (state.page === "select-input") {
      return <SelectInput state={state} updateState={updateState} />;
    } else return <></>;
  }
  return (
    <div id="App">
      <Container
        room={state.properties.room ? state.properties.room.name : "-"}
        isFullWidth={false}
      >
        <PageRenderer state={state} />
      </Container>
    </div>
  );
}

export default App;
