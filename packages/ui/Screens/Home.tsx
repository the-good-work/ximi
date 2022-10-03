import React, { Dispatch } from "react";
import Heading from "ui/Texts/Heading";
import IconButton from "ui/Buttons/IconButton";
import { Refresh } from "react-ionicons";
import { styled } from "ui/theme/theme";
import ListButton from "../Buttons/ListButton";
import { RoomStateInit, UpdateStateActions } from "../../../types/state";

export default function Home({
  state,
  updateState,
}: {
  state: RoomStateInit;
  updateState: Dispatch<UpdateStateActions>;
}) {
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

  function ListOfRooms({ rooms, ...props }: { rooms: any; props?: any }) {
    return (
      <List {...props}>
        {rooms.map((r: any) => {
          return (
            <ListButton
              onClick={() => {
                updateState({
                  type: "enter-room",
                  properties: { room: r },
                });
              }}
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

  return (
    <div className="content">
      <HeadingBox>
        <Heading
          color="gradient"
          css={{
            marginTop: "$sm",
            marginBottom: "$sm",
            textAlign: "center",
            textTransform: "uppercase",
          }}
        >
          Rooms Online
        </Heading>
        <IconButton
          iconSize={{ "@base": "md", "@md": "lg" }}
          aria-label="Refresh"
          variant="ghost"
          icon={<Refresh color="inherit" />}
          onClick={onRefresh}
        />
      </HeadingBox>
      <ListOfRooms rooms={state.properties.rooms} />
    </div>
  );
}
