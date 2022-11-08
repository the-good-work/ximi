import React, { Dispatch, useEffect } from "react";
import IconButton from "ui/Buttons/IconButton";
import Heading from "ui/Texts/Heading";
import { ReturnDownBack } from "react-ionicons";
import {
  RoomStateStage,
  UpdateStateActions,
} from "../../../../types/performerStates";
import { useRoom } from "@livekit/react-core";

export default function Stage({
  state,
  updateState,
}: {
  updateState: Dispatch<UpdateStateActions>;
  state: RoomStateStage;
}) {
  const { connect, room, error, participants } = useRoom();

  useEffect(() => {
    connect(
      `${process.env.REACT_APP_LIVEKIT_HOST}`,
      state.properties.token
    ).catch((err) => {
      console.log(err);
    });

    return () => {
      room?.disconnect(true);
    };
  }, []);

  if (error) {
    console.log(error);
  }

  return (
    <div className="content noscroll">
      <Heading
        color="gradient"
        css={{
          textAlign: "center",
          textTransform: "uppercase",
          marginTop: "$sm",
          marginBottom: "$sm",
        }}
      >
        Stage
      </Heading>

      <IconButton
        onClick={() => {
          room?.disconnect().catch((err) => {
            console.log(err);
          });
          updateState({
            type: "back-to-list",
          });
        }}
        css={{ position: "fixed", bottom: "$sm", left: "$sm" }}
        iconSize="md"
        variant="outline"
        aria-label={`Back to home`}
        icon={<ReturnDownBack color="inherit" />}
      />
    </div>
  );
}
