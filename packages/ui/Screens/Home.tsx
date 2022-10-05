import React, { Dispatch, useState } from "react";
import Heading from "ui/Texts/Heading";
import IconButton from "ui/Buttons/IconButton";
import { Refresh, SadOutline } from "react-ionicons";
import { styled } from "ui/theme/theme";
import ListButton from "../Buttons/ListButton";
import { Room, UpdateStateActions } from "../../../types/state";
import Text from "../Texts/Text";
import Icon from "../Texts/Icon";

export default function Home({
  rooms,
  updateState,
}: {
  rooms: Room[];
  updateState: Dispatch<UpdateStateActions>;
}) {
  const [isRefreshing, setIsRefreshing] = useState<boolean | null>(false);

  async function onRefresh() {
    setIsRefreshing(true);
    return await new Promise((resolve) => setTimeout(resolve, 1500)).then(
      () => {
        setIsRefreshing(false);
      }
    );
  }

  const HeadingBox = styled("div", {
    width: "100%",
    maxWidth: "600px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "$lg",
  });

  const EmptyState = styled("div", {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minWidth: "500px",
    width: "100%",
    maxWidth: "600px",
    marginTop: "$lg",
    gap: "$sm",
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
    if (isRefreshing) {
      return (
        <EmptyState>
          <Text size="md">Refreshing...</Text>
        </EmptyState>
      );
    } else if (rooms.length <= 0) {
      return (
        <EmptyState css={{ fill: "$text" }}>
          <Icon size="lg" icon={<SadOutline color="inherit" />} />
          <Text size="md">There are currently no available rooms</Text>
        </EmptyState>
      );
    } else
      return (
        <List {...props}>
          {rooms.map((r: any) => {
            return (
              <ListButton
                onClick={() => {
                  updateState({
                    type: "select-room",
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
    <div className="content scroll">
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
          css={{ borderRadius: "100%" }}
          iconSize={{ "@base": "lg", "@md": "xl" }}
          aria-label="Refresh list of rooms"
          variant="ghost"
          icon={<Refresh color="inherit" />}
          onClick={onRefresh}
          state={isRefreshing ? "loading" : "default"}
        />
      </HeadingBox>
      <ListOfRooms rooms={rooms} />
    </div>
  );
}
