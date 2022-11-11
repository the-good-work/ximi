import React, { Dispatch, useEffect } from "react";
import IconButton from "ui/Buttons/IconButton";
import ToggleIconButton from "ui/Buttons/ToggleIconButton";
import Heading from "ui/Texts/Heading";
import { ReturnDownBack } from "react-ionicons";
import {
  RoomStateStage,
  UpdateStateActions,
} from "../../../../types/performerStates";
import { UpdateStatePayload } from "@thegoodwork/ximi-types";
import { useRoom } from "@livekit/react-core";
import { DataPacket_Kind, RemoteParticipant, RoomEvent } from "livekit-client";
import ControlTray from "../components/ControlTray";

// const encoder = new TextEncoder();
const decoder = new TextDecoder();

export default function Stage({
  state,
  updateState,
}: {
  updateState: Dispatch<UpdateStateActions>;
  state: RoomStateStage;
}) {
  const { connect, room, error, participants } = useRoom();

  // every time audioMixMute changes (from Zahid's send data)
  /*
  participants.forEach((participant) => {
    if (participant.isLocal) {
      return;
    }
    try {
      const metadata = JSON.parse(participant.metadata);
      if (metadata.type === "PERFORMER") {
        (participant as RemoteParticipant).audioTracks.forEach(
          (publication) => {
            const shouldSubscribe = true; // some sort of logic determining whether we should be listening to this participant's audio
            if (publication.isSubscribed !== true && shouldSubscribe) {
							publication.setSubscribed(true);
						} else if (publication.isSubscribed === true && !shouldSubscribe) {
							publication.setSubscribed(false);
						}
          }
        );
      }
    } catch (err) {
      return;
    }
  });
	*/

  useEffect(() => {
    // loop thru participants and subscribe/unsubscribe to audio track accordingly
    // state will indiciate which are the ones on mute (i.e. to unsub)
    //
  }, [participants, state]);

  useEffect(() => {
    connect(`${process.env.REACT_APP_LIVEKIT_HOST}`, state.properties.token)
      .then((room) => {
        console.log("connected");
        if (room) {
          room.on(
            RoomEvent.DataReceived,
            (
              payload: Uint8Array,
              participant?: RemoteParticipant,
              kind?: DataPacket_Kind
            ) => {
              const string = decoder.decode(payload);
              try {
                const json: UpdateStatePayload = JSON.parse(
                  string
                ) as UpdateStatePayload;

                /*
                json.participants.map((p) => p.id);

                updateState({
                  type: "update-from-server",
                  payload: room,
                });
								*/
              } catch (err) {
                console.log(err);
                return;
              }

              /*
               * const obj = JSON.parse(strData);
               * if (obj.type === "___") {
               * ___
               * }
               */
            }
          );
        }
      })
      .catch((err) => {
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

      <ControlTray state={state} room={room} updateState={updateState} />
    </div>
  );
}
