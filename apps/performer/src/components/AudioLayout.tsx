import React, { LegacyRef, useEffect, useRef } from "react";
import { PerformerUpdatePayload } from "@thegoodwork/ximi-types/src/room";
import { Participant, RemoteParticipant } from "livekit-client";

const onlyPerformers = (p: Participant) => {
  try {
    const meta = JSON.parse(p.metadata || "");
    return meta?.type === "PERFORMER" || meta?.type === "SCOUT";
  } catch (err) {
    return false;
  }
};

export default function AudioLayout({
  participants,
  audioMixMute,
}: {
  participants: Participant[];
  audioMixMute: PerformerUpdatePayload["update"]["audioMixMute"];
}) {
  const performers = participants
    .filter(onlyPerformers)
    .filter((p) => !p.isLocal) as RemoteParticipant[];

  return (
    <>
      {performers.map((p) => (
        <AudioTrack
          key={p.identity}
          performer={p}
          muted={audioMixMute.indexOf(p.identity) > -1}
        />
      ))}
    </>
  );
}

const AudioTrack = ({
  performer,
  muted,
}: {
  performer: RemoteParticipant;
  muted: boolean;
}) => {
  const audioElem = useRef<HTMLAudioElement>();

  //currently only supports one audio track per performer
  const audioTrackPublication = Array.from(performer.audioTracks.values())?.[0];
  const audioTrack = audioTrackPublication?.track;

  useEffect(() => {
    if (!audioTrack) {
      return;
    }

    if (!audioElem.current) {
      return;
    }

    if (!audioTrackPublication.isSubscribed) {
      audioTrackPublication.setSubscribed(true);
    }

    audioTrack.attach(audioElem.current);

    audioTrackPublication.setEnabled(!muted);
  }, [
    muted,
    performer,
    audioTrackPublication,
    audioTrackPublication?.isSubscribed,
    audioTrack,
  ]);

  return (
    <div
      className={`audioTrack`}
      data-participant-identity={performer.identity}
      data-muted={muted}
    >
      <audio ref={audioElem as LegacyRef<HTMLAudioElement>} />
    </div>
  );
};
