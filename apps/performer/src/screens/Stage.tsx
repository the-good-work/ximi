import React, { Dispatch, useEffect, useState } from "react";
import Heading from "ui/Texts/Heading";
import {
  RoomStateStage,
  UpdateStateActions,
} from "../../../../types/performerStates";
import {
  PerformerUpdatePayload,
  ServerUpdate,
} from "@thegoodwork/ximi-types/src/room";
import { useRoom } from "@livekit/react-core";
import { DataPacket_Kind, RemoteParticipant, RoomEvent } from "livekit-client";
import ControlTray from "../components/ControlTray";
import VideoLayout from "../components/VideoLayout";

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
  const [trayOpen, setTrayOpen] = useState<boolean>(false);
  const [showDebug, setShowDebug] = useState<boolean>(false);

  const [audioMixMute, setAudioMixMute] = useState<
    PerformerUpdatePayload["update"]["audioMixMute"]
  >([]);

  const [video, setVideo] = useState<PerformerUpdatePayload["update"]["video"]>(
    { layout: "Default", slots: [] }
  );

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
    connect(`${process.env.REACT_APP_LIVEKIT_HOST}`, state.properties.token, {
      autoSubscribe: false,
    })
      .then((room) => {
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
                const update: ServerUpdate = JSON.parse(string) as ServerUpdate;

                if (update.type === "performer-update") {
                  setAudioMixMute(update.update.audioMixMute);
                  setVideo(update.update.video);
                }
              } catch (err) {
                console.log(err);
              }
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
    <div className="content noscroll nopadding">
      <VideoLayout
        room={room}
        participants={participants}
        videoState={video}
        showDebug={showDebug}
      />

      <ControlTray
        state={state}
        room={room}
        updateState={updateState}
        audioMixMute={audioMixMute}
        open={trayOpen}
        setOpen={setTrayOpen}
        showDebug={showDebug}
        setShowDebug={setShowDebug}
      />
    </div>
  );
}
