import React from "react";
import "./App.css";
import Container from "ui/Blocks/Container";
import Heading from "ui/Texts/Heading";
import ListOfRooms from "ui/Blocks/ListOfRooms";

const rooms = [
  { name: "asdf", id: "1", noOfParticipants: 1 },
  { name: "asdfasdsadf", id: "2", noOfParticipants: 10 },
];

function App() {
  return (
    <Container isFullWidth={false}>
      <Heading color="gradient" css={{ textAlign: "center" }}>
        ROOMS ONLINE
      </Heading>
      <ListOfRooms rooms={rooms} />
    </Container>
  );
}

export default App;
