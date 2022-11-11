import React, {
  Dispatch,
  useEffect,
  useState,
  useReducer,
  SetStateAction,
} from "react";
import {
  RoomStateStage,
  UpdateStateActions,
} from "../../../../types/controlStates";
import {
  PanelStates,
  Preset,
  PresetAction,
} from "../../../../types/stageStates";
import { useRoom } from "@livekit/react-core";
import { styled } from "ui/theme/theme";
import {
  ParticipantControl,
  ParticipantPerformer,
  UpdateStatePayload,
} from "@thegoodwork/ximi-types";
import {
  DataPacket_Kind,
  Participant,
  RemoteParticipant,
  RoomEvent,
} from "livekit-client";
import { Root, Scrollbar, Viewport } from "@radix-ui/react-scroll-area";
import AudioMixCard from "../components/AudioMixCard";
import Text from "ui/Texts/Text";
import {
  ChatboxSharp,
  ExitSharp,
  Sad,
  VideocamSharp,
  VolumeHighSharp,
} from "react-ionicons";
import VideoPanel from "../components/VideoPanel";
import PanelButton from "../components/PanelButton";
import Button from "ui/Buttons/Button";
import Presets from "../components/Presets";

const decoder = new TextDecoder();

const StyledStage = styled("div", {
  display: "flex",
  width: "100%",
  height: "100%",
  justifyContent: "space-between",
  alignItems: "center",
  flexDirection: "row",
});

const StyledAudioPanel = styled("div", {
  height: "100%",
  width: "100%",
  color: "white",
  gridGap: "$md",
  boxSizing: "border-box",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
});

const StyledEmptyState = styled("div", {
  height: "100%",
  width: "100%",
  color: "white",
  display: "flex",
  opacity: "0.8",
  gap: "$sm",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  ".icon": {
    path: {
      fill: "$text",
    },
  },
});

const StyledRoot = styled(Root, {
  height: "100%",
  width: "100%",
  overflow: "hidden",
});

const StyledViewport = styled(Viewport, {
  height: "100%",
  width: "100%",
  paddingRight: "$lg",
  boxSizing: "border-box",
});

const StyledSidebar = styled("div", {
  display: "flex",
  width: "250px",
  flexDirection: "column",
  boxSizing: "border-box",
  alignItems: "start",
  justifyContent: "start",
  height: "100%",
  color: "$text",

  ".topSpacer": {
    borderLeft: "2px solid $brand",
    boxSizing: "border-box",
    padding: "0",
  },

  ".controls": {
    borderLeft: "2px solid $brand",
    height: "100%",
    width: "100%",
    padding: "$sm",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    boxSizing: "border-box",
    gap: "$sm",

    "> div": {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "$sm",
    },
  },
});

function StagePanel({
  activePanel,
  participantsSettings,
  roomName,
  participants,
}: {
  activePanel: PanelStates;
  participantsSettings: UpdateStatePayload | any;
  roomName: string;
  participants: Participant[];
}) {
  if (participantsSettings) {
    if (activePanel === "audio") {
      if (participantsSettings.length <= 0) {
        return (
          <StyledEmptyState>
            {/* <div className="icon" aria-hidden="true">
              <Sad width="32px" height="32px" />
            </div>
            <Text>There is no one in this room</Text> */}
            <Text>Loading...</Text>
          </StyledEmptyState>
        );
      } else
        return (
          <StyledRoot>
            <StyledViewport>
              <StyledAudioPanel>
                {participantsSettings.map((p: ParticipantPerformer) => {
                  return (
                    <AudioMixCard
                      key={p.sid}
                      participants={participants}
                      roomName={roomName}
                      participantSettings={p}
                      type={p.type}
                      audioMixMute={p.audioMixMute}
                      audioDelay={p.audioOutDelay}
                    />
                  );
                })}
              </StyledAudioPanel>
            </StyledViewport>
            <Scrollbar orientation="vertical" />
          </StyledRoot>
        );
    } else
      return (
        <StyledRoot>
          <StyledViewport>
            {/* <VideoPanel
              participants={participants}
              currentParticipant={
                participants
                  ? participants.length >= 2
                    ? participants[1]
                    : participants[0]
                  : undefined
              }
            /> */}
          </StyledViewport>
          <Scrollbar orientation="vertical" />
        </StyledRoot>
      );
  } else return <></>;
}

function StageSidebar({
  activePanel,
  setActivePanel,
  updateState,
  presets,
  setPresets,
}: {
  activePanel: PanelStates;
  setActivePanel: Dispatch<SetStateAction<PanelStates>>;
  updateState: Dispatch<UpdateStateActions>;
  presets: any[];
  setPresets: Dispatch<PresetAction>;
}) {
  const { room } = useRoom();
  return (
    <StyledSidebar>
      <div className="topSpacer" />
      <PanelButton
        onClick={() => {
          setActivePanel("audio");
        }}
        active={activePanel === "audio"}
        icon={<VolumeHighSharp />}
        css={{
          ".icon": {
            span: {
              svg: {
                color: activePanel === "audio" ? "$accent" : "$text",
              },
              "path:not(:last-child)": {
                fill: "none",
              },
            },
          },
        }}
      >
        Audio
      </PanelButton>
      <PanelButton
        onClick={() => {
          setActivePanel("video");
        }}
        active={activePanel === "video"}
        icon={<VideocamSharp />}
      >
        Video
      </PanelButton>
      <div className="controls">
        <div>
          <Button
            size="sm"
            icon={<ChatboxSharp />}
            css={{
              alignItems: "center",
              justifyContent: "center",
              textTransform: "uppercase",
              ".icon": {
                span: {
                  path: { fill: "$text" },
                },
              },
            }}
          >
            Message
          </Button>
          <Presets presets={presets} setPresets={setPresets} />
        </div>
        <Button
          size="sm"
          css={{
            alignItems: "center",
            justifyContent: "center",
            textTransform: "uppercase",
          }}
          icon={<ExitSharp />}
          type="negative"
          onClick={async () => {
            if (room) {
              await room.disconnect();
              console.log("disconnected");
            }

            updateState({
              type: "back-to-list",
            });
          }}
        >
          Exit
        </Button>
      </div>
    </StyledSidebar>
  );
}

export default function Stage({
  state,
  updateState,
  setControllerName,
}: {
  updateState: Dispatch<UpdateStateActions>;
  state: RoomStateStage;
  setControllerName: Dispatch<SetStateAction<string>>;
}) {
  const [stage, setStage] = useState<undefined | UpdateStatePayload | any>(
    undefined
  );
  const [lastUpdatedParticipant, setLastUpdatedParticipant] = useState<
    undefined | UpdateStatePayload | any
  >(undefined);
  const initialState = Array.apply(null, Array(12)).map((_a, i) => {
    return {
      name: `SLOT${i < 9 ? `0${i + 1}` : i + 1}`,
      saved: false,
      index: i,
    };
  });
  const { connect, room, error, participants } = useRoom();

  const [presets, setPresets] = useReducer(reducer, initialState);
  const [activePanel, setActivePanel] = useState<PanelStates>("audio");

  function reducer(_state: Preset[], action: PresetAction) {
    if (action.type === "update-preset") {
      const updatedPreset = {
        name: action.name,
        saved: action.saved,
        index: action.index,
      };
      _state.splice(action.index, 1, updatedPreset);
      const __state = _state.slice();
      return __state;
    } else return initialState;
  }

  useEffect(() => {
    // loop thru participants and subscribe/unsubscribe to audio track accordingly
    // state will indiciate which are the ones on mute (i.e. to unsub)
    //
    //
    // every time audioMixMute changes (from Zahid's send data)

    participants.forEach((participant) => {
      if (participant) {
        if (participant.isLocal) {
          return;
        } else if (participant.metadata) {
          try {
            const metadata = JSON.parse(participant.metadata);
            if (metadata.type === "PERFORMER") {
              (participant as RemoteParticipant).audioTracks.forEach(
                (publication) => {
                  const shouldSubscribe = true; // some sort of logic determining whether we should be listening to this participant's audio
                  if (publication.isSubscribed !== true && shouldSubscribe) {
                    publication.setSubscribed(true);
                    // console.log(publication.subscriptionStatus);
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
        }
      }
    });
  }, [participants, state]);

  useEffect(() => {
    connect(`${process.env.REACT_APP_LIVEKIT_HOST}`, state.token)
      .then((rm) => {
        if (rm) {
          setControllerName(rm?.localParticipant.identity || "");
          rm.on(
            RoomEvent.DataReceived,
            (
              payload: Uint8Array,
              participant?: RemoteParticipant,
              kind?: DataPacket_Kind
            ) => {
              const string = decoder.decode(payload);
              try {
                const json = JSON.parse(string);
                if (json.sid) {
                  setLastUpdatedParticipant(json);
                } else {
                  setStage(json);
                }
              } catch (err) {
                console.log(err);
                return;
              }

              /*
               * const obj = JSON.parse(strData);
               * if (obj.type === "___") {
               * ___
               * }
               */
            }
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // useEffect(() => {
  //   if (room) {
  //     if (room.localParticipant) {
  //       // console.log(room, participants, room.localParticipant);
  //     }
  //   }
  // }, [room]);

  if (error) {
    console.log(error);
  }

  // console.log(stage);
  // console.log(lastUpdatedParticipant);

  return (
    <div className="content noscroll">
      <StyledStage>
        {activePanel === "audio" ? <></> : <></>}
        <StagePanel
          roomName={room?.name || ""}
          participants={participants}
          activePanel={activePanel}
          participantsSettings={stage?.participants || []}
        />
        <StageSidebar
          presets={presets}
          setPresets={setPresets}
          updateState={updateState}
          activePanel={activePanel}
          setActivePanel={setActivePanel}
        />
      </StyledStage>
    </div>
  );
}
