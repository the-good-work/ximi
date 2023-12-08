import {
  LiveKitRoom,
  useStartAudio,
  useRoomContext,
  useParticipants,
} from "@livekit/components-react";
import { useState, useEffect, useMemo, useRef } from "react";
import { VideoFrame } from "ui/tailwind";
import qs from "qs";
import ShortUniqueId from "short-unique-id";
import { FaPlay } from "react-icons/fa6";
import { XimiParticipantState } from "types";
import { RemoteParticipant } from "livekit-client";

const SERVER_HOST = import.meta.env.VITE_XIMI_SERVER_HOST || "";

const uid = new ShortUniqueId({
  dictionary: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
});

function App() {
  const { room, passcode, target, mode } = qs.parse(window.location.search, {
    ignoreQueryPrefix: true,
  });

  const rand = useMemo(() => uid.rnd(6), []);
  const [identity] = useState<string>(`OUT${rand}`);
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
  const participants = useParticipants();
  const participant = participants.find(
    (p) => p.identity === target,
  ) as RemoteParticipant;
  const room = useRoomContext();
  const { canPlayAudio, mergedProps } = useStartAudio({
    room,
    props: { style: { display: "flex" } },
  });

  const audioRef = useRef<HTMLMediaElement>(null);
  const AudioCtxRef = useRef<AudioContext>();
  const mediaStreamSource = useRef<MediaStreamAudioSourceNode>();
  const delayNode = useRef<DelayNode>();

  const videoOn = mode === "1" || mode === "2";
  const audioOn = mode === "0" || mode === "2";

  useEffect(() => {
    if (participant?.metadata === undefined) {
      return;
    }

    try {
      const pState = JSON.parse(
        participant.metadata || "",
      ) as XimiParticipantState;
      if (typeof pState.audio.delay === "number") {
        if (delayNode.current !== undefined) {
          delayNode.current.delayTime.value = pState.audio.delay / 1000;
          console.log(`delay set to ${pState.audio.delay}`);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }, [participant?.metadata]);

  useEffect(() => {
    if (!canPlayAudio) {
      return;
    }

    if (participant === undefined || participant.audioTracks.size < 0) {
      return;
    }

    if (AudioCtxRef.current === undefined) {
      AudioCtxRef.current = new AudioContext();
    }

    if (delayNode.current === undefined) {
      delayNode.current = new DelayNode(AudioCtxRef.current, {
        maxDelayTime: 5,
        delayTime: 0,
      });
    }

    const targetTrack = Array.from(participant.audioTracks)?.[0]?.[1].track;

    if (audioRef.current !== null && targetTrack !== undefined) {
      targetTrack.attach(audioRef.current);
      audioRef.current.muted = true;
    }

    if (mediaStreamSource.current === undefined && targetTrack !== undefined) {
      mediaStreamSource.current = AudioCtxRef.current.createMediaStreamSource(
        new MediaStream([targetTrack.mediaStreamTrack]),
      );

      mediaStreamSource.current
        .connect(delayNode.current)
        .connect(AudioCtxRef.current.destination);
    }

    if (AudioCtxRef.current.state !== "running") {
      AudioCtxRef.current.resume();
    }
  }, [canPlayAudio, participant?.audioTracks?.size, participant]);

  if (participant === undefined) {
    return <div>Loading</div>;
  }

  const audioTrackPub =
    participant.audioTracks.size > 0
      ? Array.from(participant.audioTracks)[0][1].source
      : undefined;

  return (
    <div className="object-cover w-full h-[100vh] overflow-hidden">
      {audioOn && audioTrackPub && (
        <>
          {/*
          <AudioTrack participant={participant} source={audioTrackPub} />
					*/}
          <audio ref={audioRef} />

          {!canPlayAudio && (
            <button {...mergedProps}>
              <div className="fixed z-10 flex items-center justify-center w-8 h-8 p-0 bottom-2 right-2 text-text bg-bg/10">
                <FaPlay size={16} />
              </div>
            </button>
          )}
        </>
      )}

      {videoOn && participant.videoTracks.size > 0 && (
        <VideoFrame identity={target} full={true} preview={false} />
      )}
    </div>
  );
};
