import { LegacyRef, useEffect, useRef, useState } from "react";
import { useParticipant, useRoom } from "@livekit/react-core";
import queryString from "query-string";
import {
  Participant,
  RemoteTrackPublication,
  RoomEvent,
  Track,
} from "livekit-client";
import { ServerUpdate } from "@thegoodwork/ximi-types/src/room";
import { VolumeHighOutline } from "react-ionicons";

const decoder = new TextDecoder();

function App() {
  const { participants, connect } = useRoom();
  const [target, setTarget] = useState<string>();
  const [withAudio, setWithAudio] = useState<boolean>(false);
  const thisParticipant = participants.find((p) => p.identity === target);
  const [delay, setDelay] = useState(0);

  useEffect(() => {
    // get param upon load
    const query = queryString.parse(window.location.search);
    setWithAudio(() => query.withAudio === "true");

    const joinPayload = {
      participant_type: "OUTPUT",
      room_name: query.room,
      performer_target: query.target,
      passcode: query.passcode,
    };

    setTarget(query.target as string);

    fetch(`${process.env.REACT_APP_SERVER_HOST}/rooms/validate-passcode`, {
      method: "POST",
      body: JSON.stringify(joinPayload),
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      response.json().then((body) => {
        const token = body.data;
        connect(`${process.env.REACT_APP_LIVEKIT_HOST}`, token, {
          autoSubscribe: false,
        }).then((room) => {
          if (!room) {
            return;
          }
          room.on(RoomEvent.DataReceived, (payload) => {
            const string = decoder.decode(payload);
            try {
              const json = JSON.parse(string) as ServerUpdate;

              if (!json.type) {
                return;
              }

              if (json.type === "output-update") {
                const delay = json.update.performer.audioOutDelay || 0;
                setDelay(delay);
              }
            } catch (err) {
              console.log(err);
              return;
            }
          });
        });
      });
    });
  }, []);

  return (
    <div id="App">
      {thisParticipant && (
        <>
          {withAudio && (
            <PerformerAudio performer={thisParticipant} delay={delay} />
          )}
          <PerformerVideo performer={thisParticipant} />
        </>
      )}
    </div>
  );
}

export default App;

const PerformerAudio = ({
  performer,
  delay,
}: {
  performer: Participant;
  delay: number;
}) => {
  const [start, setStart] = useState<boolean>(false);

  const p = useParticipant(performer);

  const audioRef = useRef<HTMLAudioElement>();
  const firstAudioTrack = p.publications.find(
    (pub) => pub.kind === Track.Kind.Audio
  ) as RemoteTrackPublication | undefined;

  /* refs to AudioContext (HTML WebAudio) objects */
  const AudioCtxRef = useRef<AudioContext>();
  const mediaStream = useRef<MediaStream>();
  const mediaStreamSource = useRef<MediaStreamAudioSourceNode>();
  const delayNode = useRef<DelayNode>();

  useEffect(() => {
    if (delayNode.current) {
      delayNode.current.delayTime.value = delay / 1000;
    }
  }, [delay]);

  useEffect(() => {
    if (firstAudioTrack) {
      if (!firstAudioTrack.isSubscribed) {
        firstAudioTrack.setSubscribed(true);
      } else {
        firstAudioTrack.setEnabled(true);

        if (audioRef.current) {
          firstAudioTrack.track?.attach(audioRef.current);
          audioRef.current.muted = true;
        }
      }
    }
  }, [firstAudioTrack, firstAudioTrack?.isSubscribed, start]);

  return (
    <>
      {!start && (
        <button
          onClick={() => {
            const track = firstAudioTrack?.track;

            if (
              !mediaStream.current &&
              track &&
              track.mediaStreamTrack instanceof MediaStreamTrack
            ) {
              const AudioContext = window.AudioContext;

              AudioCtxRef.current = new AudioContext();
              delayNode.current = new DelayNode(AudioCtxRef.current, {
                maxDelayTime: 5,
                delayTime: delay,
              });

              const audioDom = track.attach();
              audioDom.muted = true;

              mediaStream.current = new MediaStream([track.mediaStreamTrack]);
              mediaStreamSource.current =
                AudioCtxRef.current.createMediaStreamSource(
                  mediaStream.current
                );
              mediaStreamSource.current
                .connect(delayNode.current)
                .connect(AudioCtxRef.current.destination);
            }
            setStart(true);
          }}
          style={{
            position: "fixed",
            bottom: "10px",
            right: "10px",
            zIndex: 5,
            background: "transparent",
            color: "white",
            appearance: "none",
            border: 0,
          }}
        >
          <VolumeHighOutline color={"white"} />
        </button>
      )}
      <audio ref={audioRef as LegacyRef<HTMLAudioElement>} />
    </>
  );
};

const PerformerVideo = ({ performer }: { performer: Participant }) => {
  const p = useParticipant(performer);
  const videoRef = useRef<HTMLVideoElement>();
  const firstVideoTrack = p.publications.find(
    (pub) => pub.kind === Track.Kind.Video
  ) as RemoteTrackPublication | undefined;
  useEffect(() => {
    if (firstVideoTrack) {
      if (!firstVideoTrack.isSubscribed) {
        firstVideoTrack.setSubscribed(true);
      } else {
        firstVideoTrack.setEnabled(true);
        if (videoRef.current) {
          firstVideoTrack.track?.attach(videoRef.current);
        }
      }
    }
  }, [firstVideoTrack, firstVideoTrack?.isSubscribed]);

  return (
    <>
      <video
        ref={videoRef as LegacyRef<HTMLVideoElement>}
        style={{
          width: "100%",
          height: "100%",
          position: "fixed",
          objectFit: "cover",
        }}
      />
    </>
  );
};
