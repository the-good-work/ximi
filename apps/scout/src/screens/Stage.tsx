import React, { Dispatch, useEffect, useState } from "react";
import {
  RoomStateStage,
  UpdateStateActions,
} from "../../../../types/performerStates";
import {
  MessagePayload,
  PerformerUpdatePayload,
  PongPayload,
  ServerUpdate,
} from "@thegoodwork/ximi-types/src/room";
import { useRoom } from "@livekit/react-core";
import { DataPacket_Kind, RemoteParticipant, RoomEvent } from "livekit-client";
import ControlTray from "../components/ControlTray";
import TextPoster from "../components/TextPoster";
import AudioLayout from "../components/AudioLayout";
import MessageModal from "../components/MessageModal";
import { useToast } from "ui";

const encoder = new TextEncoder();
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
  const [messageOpen, setMessageOpen] = useState<boolean>(false);
  const [showDebug, setShowDebug] = useState<boolean>(false);
  const [tick, setTick] = useState<0 | 1>(0);

  const [audioMixMute, setAudioMixMute] = useState<
    PerformerUpdatePayload["update"]["audioMixMute"]
  >([]);

  const { toast } = useToast();
  const [textPoster, setTextPoster] = useState("");

  useEffect(() => {
    connect(`${process.env.REACT_APP_LIVEKIT_HOST}`, state.properties.token, {
      autoSubscribe: false,
    })
      .then((room) => {
        if (room) {
          room.on(
            RoomEvent.DataReceived,
            (payload: Uint8Array, remoteParticipant?: RemoteParticipant) => {
              const string = decoder.decode(payload);

              try {
                const update: ServerUpdate = JSON.parse(string) as ServerUpdate;

                /*@ts-ignore*/
                if (update.type === "tick") {
                  setTick((t) => (t === 0 ? 1 : 0));
                } else if (update.type === "scout-update") {
                  if (update.update.name === state.properties.name) {
                    setAudioMixMute(update.update.audioMixMute);
                    setTextPoster(update.update.textPoster);
                  }
                } else if (update.type === "message") {
                  toast({
                    title: update.message,
                    description: update.sender,
                  });
                } else if (update.type === "ping") {
                  const payload = JSON.stringify({
                    type: "pong",
                    id: update.id,
                    target: update.target,
                  } as PongPayload);

                  const data = encoder.encode(payload);

                  if (remoteParticipant) {
                    room.localParticipant.publishData(
                      data,
                      DataPacket_Kind.RELIABLE,
                      [remoteParticipant]
                    );
                  }
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

  useEffect(() => {
    participants.forEach((participant) => {
      if (participant.isLocal) {
        return;
      }
      try {
        const metadata = JSON.parse(participant.metadata || "");
        if (metadata.type === "PERFORMER" || metadata.type === "SCOUT") {
          (participant as RemoteParticipant).audioTracks.forEach(
            (publication) => {
              const shouldSubscribe = true; // some sort of logic determining whether we should be listening to this participant's audio
              if (!publication.isSubscribed) {
                publication.setSubscribed(true);
              } else if (
                publication.isSubscribed === true &&
                !shouldSubscribe
              ) {
                publication.setSubscribed(false);
              }
            }
          );
        }
      } catch (err) {
        return;
      }
    });
  }, [participants, state, tick]);

  if (error) {
    console.log(error);
  }

  return (
    <div className="content noscroll nopadding">
      {/*
				<VideoLayout
					participants={participants}
					videoState={video}
					showDebug={showDebug}
				/>
			*/}

      <TextPoster text={textPoster} />

      <AudioLayout participants={participants} audioMixMute={audioMixMute} />

      <MessageModal
        open={messageOpen}
        setOpen={setMessageOpen}
        sendMessage={(message) => {
          if (!room) return;
          const msgData = JSON.stringify({
            type: "message",
            message,
            sender: state.properties.name,
          } as MessagePayload);
          const data = encoder.encode(msgData);
          room.localParticipant.publishData(data, DataPacket_Kind.RELIABLE);

          toast({
            title: message,
            description: "Message Sent",
          });
        }}
      />

      <ControlTray
        state={state}
        room={room}
        updateState={updateState}
        audioMixMute={audioMixMute}
        open={trayOpen}
        setOpen={setTrayOpen}
        setOpenMessage={setMessageOpen}
        showDebug={showDebug}
        setShowDebug={setShowDebug}
      />
    </div>
  );
}
