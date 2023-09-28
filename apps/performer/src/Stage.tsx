import { useLocalParticipant, useRoomContext } from "@livekit/components-react";
import { DataPacket_Kind, RoomEvent } from "livekit-client";
import { useEffect, useState } from "react";
import {
  MessageDataPayload,
  PingDataPayload,
  PongDataPayload,
  XimiParticipantState,
} from "types";
import {
  AudioInputControl,
  AudioRenderer,
  VideoRenderer,
  CameraControl,
  ChatControl,
  ScreencastControl,
} from "ui/tailwind";

const Stage = () => {
  const { localParticipant } = useLocalParticipant();
  const room = useRoomContext();
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setTick((t) => (t === 0 ? 1 : 0));
    }, 2500);
    return () => {
      window.clearInterval(id);
    };
  }, [localParticipant.metadata]);

  // pong response
  useEffect(() => {
    const handleDataReceived = (payload: Uint8Array) => {
      const decoder = new TextDecoder();
      const data = decoder.decode(payload);

      try {
        const payload:
          | MessageDataPayload
          | PingDataPayload
          | PongDataPayload
          | undefined = JSON.parse(data) as
          | MessageDataPayload
          | PingDataPayload
          | PongDataPayload;

        if (payload === undefined) {
          throw new Error("invalid payload");
        }

        if (payload.type === "ping") {
          const pongPayload: PongDataPayload = {
            id: payload.id,
            type: "pong",
          };

          const encoder = new TextEncoder();
          const pongData = encoder.encode(JSON.stringify(pongPayload));

          localParticipant.publishData(pongData, DataPacket_Kind.RELIABLE, [
            payload.sender,
          ]);
        }
      } catch (err) {
        console.warn(err);
      }
    };
    room.on(RoomEvent.DataReceived, handleDataReceived);

    return () => {
      room.off(RoomEvent.DataReceived, handleDataReceived);
    };
  }, [room, localParticipant]);

  try {
    if (localParticipant.metadata === undefined) {
      console.warn("local participant does not have metadata");
      return <>loading</>;
    }

    return (
      <div className="relative w-full h-[calc(100%-33px)]" id="stage">
        <AudioRenderer />
        <VideoRenderer thisPerformerIdentity={localParticipant.identity} />
        <div className="fixed flex p-1 text-lg border rounded-sm controls left-4 bottom-4 border-text gap-1 bg-bg">
          <CameraControl />
          <ScreencastControl />
          <AudioInputControl />
          <ChatControl />
        </div>
      </div>
    );
  } catch (err) {
    return <>Error</>;
  }
};

export { Stage };
