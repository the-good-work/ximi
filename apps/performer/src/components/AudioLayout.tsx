import React, { useEffect, useState } from "react";
import { PerformerUpdatePayload } from "@thegoodwork/ximi-types/src/room";
import {
  Participant,
  RemoteParticipant,
  RemoteTrackPublication,
} from "livekit-client";

const onlyPerformers = (p: Participant) => {
  try {
    const meta = JSON.parse(p.metadata || "");
    return meta?.type === "PERFORMER";
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

  const [activeTracks, setActiveTracks] = useState<RemoteTrackPublication[]>(
    []
  );

  useEffect(() => {
    const _activeTracks: RemoteTrackPublication[] = [];
    performers.forEach((performer) => {
      const audioTracks = Array.from(performer.audioTracks.values());
      if (audioMixMute.indexOf(performer.identity) > -1) {
        audioTracks.forEach((track) => {
          track.setSubscribed(false);
          track.setEnabled(false);
        });
      } else {
        audioTracks.forEach((track) => {
          track.setSubscribed(true);
          track.setEnabled(true);
          _activeTracks.push(track);
        });
      }
    });
    setActiveTracks(_activeTracks);
  }, [performers, audioMixMute]);
  return <></>;
}
