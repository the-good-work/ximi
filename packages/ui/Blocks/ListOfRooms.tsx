import React from "react";
import { styled } from "@stitches/react";
import ListButton from "../Buttons/ListButton";

const List = styled("ul", {
  display: "flex",
  flexDirection: "column",
  gap: "$md",
  minWidth: "500px",
  paddingLeft: "0",
});

export default function ListOfRooms({ rooms }: { rooms: any }) {
  return (
    <List>
      {rooms.map((r: any) => {
        return (
          <li key={r.id}>
            <ListButton noOfParticipants={r.noOfParticipants}>
              {r.name}
            </ListButton>
          </li>
        );
      })}
    </List>
  );
}
