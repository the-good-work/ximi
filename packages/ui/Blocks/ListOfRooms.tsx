import React from "react";
import { styled } from "../theme/theme";
import ListButton from "../Buttons/ListButton";

const List = styled("ul", {
  display: "flex",
  flexDirection: "column",
  minWidth: "500px",
  width: "100%",
  maxWidth: "600px",
  paddingLeft: "0",
  listStyle: "none",

  "@base": {
    gap: "$xs",
  },
  "@md": {
    gap: "$sm",
  },
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
            key={r.id}
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
