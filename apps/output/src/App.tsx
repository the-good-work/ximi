import {
  LiveKitRoom,
  useRemoteParticipant,
  AudioTrack,
  StartAudio,
  useStartAudio,
  useRoomContext,
} from "@livekit/components-react";
import { useState, useEffect, useMemo } from "react";
import { VideoFrame } from "ui/tailwind";
import * as qs from "qs";
import ShortUniqueId from "short-unique-id";

const SERVER_HOST = import.meta.env.VITE_XIMI_SERVER_HOST || "";

const uid = new ShortUniqueId({
  dictionary: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
});

function App() {
  const { room, passcode, target, mode } = qs.parse(window.location.search, {
    ignoreQueryPrefix: true,
  });

  const rand = useMemo(() => uid.rnd(6), []);
  const [identity, setIdentity] = useState<string>(`OUT${rand}`);
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    fetch(`${SERVER_HOST}/room/token/output`, {
      method: "POST",
      body: JSON.stringify({
        identity,
        passcode,
        roomName: room,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      response.json().then((_token) => {
        setToken(() => _token.token);
      });
    });
  }, [room, passcode, target, mode, identity]);

  if (
    typeof room !== "string" ||
    typeof passcode !== "string" ||
    typeof target !== "string" ||
    typeof mode !== "string"
  ) {
    return <div>URL Invalid</div>;
  }

  return (
    <LiveKitRoom
      token={token}
      serverUrl={import.meta.env.VITE_XIMI_LIVEKIT_HOST}
      connect={token !== ""}
    >
      <OutputModule target={target} mode={mode} />
    </LiveKitRoom>
  );
}

export default App;

const OutputModule = ({ target, mode }: { target: string; mode: string }) => {
  const participant = useRemoteParticipant(target);
  const room = useRoomContext();
  const { canPlayAudio } = useStartAudio({
    room,
    props: {},
  });

  const videoOn = mode === "1" || mode === "2";
  const audioOn = mode === "0" || mode === "2";

  if (participant === undefined) {
    return <div>Loading</div>;
  }
  return (
    <div className="object-cover w-full h-[100vh] overflow-hidden">
      {audioOn && participant.audioTracks.size > 0 && (
        <>
          <AudioTrack
            participant={participant}
            source={Array.from(participant.audioTracks)[0][1].source}
          />

          {!canPlayAudio && (
            <div className="fixed z-10 w-24 h-24 bottom-2 right-2 bg-bg text-text">
              <StartAudio label=">" />
            </div>
          )}
        </>
      )}

      {videoOn && participant.videoTracks.size > 0 && (
        <VideoFrame identity={target} full={true} preview={false} />
      )}
    </div>
  );
};
