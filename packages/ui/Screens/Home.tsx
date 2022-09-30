import React from "react";
import Container from "ui/Blocks/Container";
import Heading from "ui/Texts/Heading";
import ListOfRooms from "ui/Blocks/ListOfRooms";
import IconButton from "ui/Buttons/IconButton";
import { Refresh } from "react-ionicons";
import { styled } from "ui/theme/theme";

export default function Home() {
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

  function onRefresh() {
    console.log("refresh");
  }

  const HeadingBox = styled("div", {
    width: "100%",
    maxWidth: "600px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  });

  return (
    <Container room={"-"} isFullWidth={false}>
      <HeadingBox>
        <Heading
          color="gradient"
          css={{
            textAlign: "center",
            paddingBottom: { "@base": "$xl", "@md": "$3xl" },
          }}
        >
          ROOMS ONLINE
        </Heading>
        <IconButton
          iconSize={{ "@base": "md", "@md": "lg" }}
          aria-label="Refresh"
          variant="ghost"
          icon={<Refresh color="inherit" />}
          onClick={onRefresh}
        />
      </HeadingBox>
      <ListOfRooms rooms={rooms} />
    </Container>
  );
}
