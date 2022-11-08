import React, { Dispatch, useEffect } from "react";
import IconButton from "ui/Buttons/IconButton";
import ToggleIconButton from "ui/Buttons/ToggleIconButton";
import Heading from "ui/Texts/Heading";
import { ReturnDownBack } from "react-ionicons";
import {
  RoomStateStage,
  UpdateStateActions,
} from "../../../../types/performerStates";
import { useRoom } from "@livekit/react-core";
import ControlTray from "../components/ControlTray";

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

      <ControlTray room={room} updateState={updateState} />
    </div>
  );
}
