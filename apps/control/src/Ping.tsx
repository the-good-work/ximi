import { useLocalParticipant, useRoomContext } from "@livekit/components-react";
import { DataPacket_Kind, RemoteParticipant, RoomEvent } from "livekit-client";
import { useEffect, useState } from "react";
import { MessageDataPayload, PingDataPayload, PongDataPayload } from "types";

const Pinger: React.FC<{ participant: RemoteParticipant }> = ({
  participant,
}) => {
  const { localParticipant } = useLocalParticipant();
  const room = useRoomContext();
  const [ping, setPing] = useState(0);

  useEffect(() => {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    let now: number;
    let pingId = new Date().getTime().toString();

    const dataReceivedHandler = (payload: Uint8Array) => {
      const data = decoder.decode(payload);
      try {
        const dataParsed = JSON.parse(data) as
          | PongDataPayload
          | PingDataPayload
          | MessageDataPayload;

        if (dataParsed.type === "pong") {
          if (dataParsed.id === pingId) {
            const timeDelta = new Date().getTime() - now;
            setPing(() => timeDelta);
            pingId = new Date().getTime().toString();
          }
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    };

    room.on(RoomEvent.DataReceived, dataReceivedHandler);

    const id = setInterval(() => {
      const payload: PingDataPayload = {
        type: "ping",
        id: pingId,
        sender: localParticipant.sid,
      };
      const data = encoder.encode(JSON.stringify(payload));
      now = new Date().getTime();
      localParticipant.publishData(data, DataPacket_Kind.RELIABLE, [
        participant,
      ]);
    }, 2000);
    return () => {
      console.log("cleared");
      clearInterval(id);
      room.off(RoomEvent.DataReceived, dataReceivedHandler);
    };
  }, [
    localParticipant.sid,
    participant.sid,
    localParticipant,
    participant,
    room,
  ]);

  return <>{ping}</>;
};

export { Pinger };
