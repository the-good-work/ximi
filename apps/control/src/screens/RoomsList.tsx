import { Dispatch } from "react";
import useSWR from "swr";
import Text from "ui/Texts/Text";
import IconButton from "ui/Buttons/IconButton";
import ListButton from "ui/Buttons/ListButton";
import Button from "ui/Buttons/Button";
import { styled } from "ui/theme/theme";
import { Room, UpdateStateActions } from "../../../../types/controlStates";
import Icon from "ui/Texts/Icon";
import { Add, SadOutline, SyncOutline } from "react-ionicons";
import Heading from "ui/Texts/Heading";

const fetcher = (args: any) => fetch(args).then((res) => res.json());

const options = {
  revalidateOnFocus: false,
  revalidateIfStale: false,
  shouldRetryOnError: false,
};

export default function RoomsList({
  updateState,
}: {
  updateState: Dispatch<UpdateStateActions>;
}) {
  const { data, mutate, isValidating, error } = useSWR(
    `${process.env.REACT_APP_SERVER_HOST}/rooms/list`,
    fetcher,
    options
  );
  const rooms: Room[] = data || [];

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

  async function onRefresh() {
    mutate();
  }

  function ListOfRooms({ rooms, ...props }: { rooms: Room[]; props?: any }) {
    if (isValidating) {
      return (
        <EmptyState>
          <Text size="md">Refreshing...</Text>
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
                        room: r,
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
              css={{ borderRadius: "100%", span: { path: { fill: "none" } } }}
              iconSize={{ "@base": "lg", "@md": "xl" }}
              aria-label="Refresh list of rooms"
              variant="ghost"
              icon={<SyncOutline color="inherit" />}
              onClick={onRefresh}
              state={isValidating ? "loading" : "default"}
            />
          </div>
        </HeadingBox>
        <Button
          css={{
            maxWidth: "600px",
            textTransform: "uppercase",
            alignItems: "center",
            justifyContent: "center",
            ".square": {
              border: "1px solid $text",
            },
          }}
          size="lg"
          type="primary"
          icon={
            <div className="square">
              <Add color="inherit" />
            </div>
          }
          onClick={() => {
            updateState({
              type: "create-room",
            });
          }}
        >
          Create Room
        </Button>
        <ListOfRooms rooms={rooms} />
      </div>
    </div>
  );
}
