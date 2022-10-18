import IconButton from "ui/Buttons/IconButton";
import ListButton from "ui/Buttons/ListButton";
import { styled } from "ui/theme/theme";
import React, { Dispatch } from "react";
import Heading from "ui/Texts/Heading";
import { SyncOutline, SadOutline, Create } from "react-ionicons";
import { Room, UpdateStateActions } from "../../../../types/state";
import Text from "ui/Texts/Text";
import Icon from "ui/Texts/Icon";
import useSWR from "swr";

const fetcher = (args: any) => fetch(args).then((res) => res.json());
const options = {
  revalidateOnFocus: false,
  revalidateIfStale: false,
  shouldRetryOnError: false,
};

async function createRoomTest() {
  const response = await fetch(
    `${process.env.REACT_APP_SERVER_HOST}/rooms/create`,
    {
      method: "POST",
      body: JSON.stringify({
        name: `ROOM_${Math.floor(Math.random() * 50)}`,
        passcode: "00000",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response;
}

export default function RoomsList({
  updateState,
}: {
  updateState: Dispatch<UpdateStateActions>;
}) {
  const {
    data,
    mutate,
    isValidating: isRefreshing,
    error,
  } = useSWR(
    `${process.env.REACT_APP_SERVER_HOST}/rooms/list`,
    fetcher,
    options
  );

  const rooms: Room[] = data || [];

  async function onCreate() {
    createRoomTest()
      .then((res) => {
        mutate();
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function onRefresh() {
    mutate();
  }

  function ListOfRooms({ rooms, ...props }: { rooms: Room[]; props?: any }) {
    if (isRefreshing) {
      return (
        <EmptyState>
          <Text size="md">Refreshing...</Text>
        </EmptyState>
      );
    } else if (!data || data.length <= 0) {
      return (
        <EmptyState css={{ fill: "$text" }}>
          <Icon size="lg" icon={<SadOutline color="inherit" />} />
          <Text size="md">There are currently no available rooms</Text>
        </EmptyState>
      );
    } else if (error) {
      return (
        <EmptyState css={{ fill: "$text" }}>
          <Icon size="lg" icon={<SadOutline color="inherit" />} />
          <Text size="md">An error has occurred. Please try again later.</Text>
        </EmptyState>
      );
    } else {
      return (
        <List {...props}>
          {rooms.length &&
            rooms.map((r) => {
              if (r) {
                return (
                  <ListButton
                    onClick={() => {
                      updateState({
                        type: "select-room",
                        properties: { room: r },
                      });
                    }}
                    key={r.room}
                    as="button"
                    aria-label={`Room: ${r.room}, participants: ${r.participants}`}
                    noOfParticipants={r.participants}
                  >
                    {r.room}
                  </ListButton>
                );
              }
              return null;
            })}
        </List>
      );
    }
  }

  const HeadingBox = styled("div", {
    width: "auto",
    maxWidth: "600px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "$lg",
    position: "relative",
    "> .refresh-icon-container": {
      position: "absolute",
      left: "calc( 100% + 20px )",
    },
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

  return (
    <div className="content-scroll">
      <div className="scroll">
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
            Rooms
          </Heading>
          <div className="refresh-icon-container">
            <IconButton
              css={{ borderRadius: "100%" }}
              iconSize={{ "@base": "lg", "@md": "xl" }}
              aria-label="Refresh list of rooms"
              variant="ghost"
              icon={<SyncOutline color="inherit" />}
              onClick={onRefresh}
              state={isRefreshing ? "loading" : "default"}
            />
          </div>
        </HeadingBox>
        <ListOfRooms rooms={rooms} />
        <IconButton
          css={{
            borderRadius: "100%",
            path: { fill: "$text" },
            position: "fixed",
            bottom: "$sm",
            left: "$sm",
          }}
          iconSize={{ "@base": "lg", "@md": "xl" }}
          aria-label="Create room test"
          variant="ghost"
          icon={<Create color="inherit" />}
          onClick={onCreate}
        />
      </div>
    </div>
  );
}
