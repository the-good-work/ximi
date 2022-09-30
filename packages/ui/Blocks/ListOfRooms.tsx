import React from "react";
import { styled } from "@stitches/react";
import ListButton from "../Buttons/ListButton";

const List = styled("ul", {
  display: "flex",
  flexDirection: "column",
  minWidth: "500px",
  paddingLeft: "0",
  listStyle: "none",
  gap: "$xs",
});

export default function ListOfRooms({
  rooms,
  ...props
}: {
  rooms: any;
  props?: any;
}) {
  return (
    <List {...props}>
      {rooms.map((r: any) => {
        return (
          <ListButton
            as="button"
            aria-label={`Room: ${r.name}, participants: ${r.noOfParticipants}`}
            noOfParticipants={r.noOfParticipants}
          >
            {r.name}
          </ListButton>
        );
      })}
    </List>
  );
}
