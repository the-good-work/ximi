import {
  AudioTrack,
  useLocalParticipant,
  useRemoteParticipants,
  useRoomInfo,
} from "@livekit/components-react";
import { createLocalAudioTrack } from "livekit-client";
import { useEffect, useState } from "react";
import * as classNames from "classnames";
import { FaMicrophone, FaVolumeHigh, FaVolumeXmark } from "react-icons/fa6";
import { SwitchActivePresetAction, XimiRoomState } from "types";
import { Dialog, Transition } from "@headlessui/react";
import { Field, Formik } from "formik";
import { Button } from "ui/tailwind";
import { toast } from "react-hot-toast";

const clsSmallSidebarButton = classNames(
  "flex",
  "items-center",
  "justify-center",
  "w-full",
  "p-2",
  "hover:bg-brand/50",
);

const Stage = () => {
  const meta = useRoomInfo();
  const [roomState, setRoomState] = useState<XimiRoomState | undefined>();

  useEffect(() => {
    try {
      if (meta.metadata === undefined) {
        return;
      }
      const state = JSON.parse(meta.metadata) as XimiRoomState;
      setRoomState(state);
    } catch (err) {
      console.log(err);
    }
  }, [meta.metadata, setRoomState]);

  if (roomState === undefined) {
    return (
      <div id="stage__loading" className="h-[calc(100vh-33px)] relative w-full">
        Loading..
      </div>
    );
  }

  return (
    <div
      id="stage__base"
      className="h-[calc(100vh-33px)] relative w-full grid grid-cols-[auto_40px]"
    ></div>
  );
};

const AudioRenderer = () => {
  const p = useRemoteParticipants();

  useEffect(() => {
    p.forEach((p) => {
      p.audioTracks.forEach((track) => {
        track.setSubscribed(true);
        track.setEnabled(true);
      });
    });
  }, [p]);

  return (
    <>
      {p.map((p) => (
        <div key={`audio_renderer_p_${p.identity}`}>
          {Array.from(p.audioTracks).map(([key, track]) => {
            return (
              <AudioTrack participant={p} key={key} source={track.source} />
            );
          })}
        </div>
      ))}
    </>
  );
};

const MicControl = () => {
  const p = useLocalParticipant();
  const hasTrack = p.localParticipant.audioTracks.size > 0;
  const [muted, setMuted] = useState(false);

  return (
    <>
      <button
        type="button"
        className={`${clsSmallSidebarButton} ${
          hasTrack ? "text-accent" : "text-text"
        }`}
        onClick={async () => {
          if (hasTrack) {
            p.localParticipant.audioTracks.forEach(async ({ track }) => {
              if (track !== undefined) {
                await p.localParticipant.unpublishTrack(track);
              }
            });
          } else {
            const newTrack = await createLocalAudioTrack({
              autoGainControl: false,
              echoCancellation: true,
              noiseSuppression: true,
              sampleRate: 48000,
              channelCount: 2,
            });
            await p.localParticipant.publishTrack(newTrack);
          }
        }}
      >
        <FaMicrophone size={16} />
      </button>
      <button
        type="button"
        className={`${clsSmallSidebarButton} ${
          hasTrack
            ? muted
              ? "text-negative"
              : "text-text"
            : "text-disabled/50"
        }
				 ${hasTrack ? "pointer-events-auto" : "pointer-events-none"}
				`}
        onClick={() => {
          if (muted) {
            p.localParticipant.audioTracks.forEach(async (track) => {
              await track.unmute();
              setMuted(false);
            });
          } else {
            p.localParticipant.audioTracks.forEach(async (track) => {
              await track.mute();
            });
            setMuted(true);
          }
        }}
      >
        {muted ? <FaVolumeXmark /> : <FaVolumeHigh />}
      </button>
    </>
  );
};

export { Stage };
