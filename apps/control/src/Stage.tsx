import {
  AudioTrack,
  useLocalParticipant,
  useRemoteParticipants,
  useRoomContext,
  useRoomInfo,
} from "@livekit/components-react";
import {
  createLocalAudioTrack,
  DataPacket_Kind,
  RoomEvent,
} from "livekit-client";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import * as classNames from "classnames";
import {
  FaA,
  FaClapperboard,
  FaDownload,
  FaEye,
  FaMessage,
  FaMicrophone,
  FaUpload,
  FaVideo,
  FaVolumeHigh,
  FaVolumeXmark,
} from "react-icons/fa6";
import {
  MessageDataPayload,
  SwitchActivePresetAction,
  XimiRoomState,
} from "types";
import { PresetRenamer } from "./PresetRenamer";
import { AudioLayout } from "./AudioLayout";
import { Dialog, Transition } from "@headlessui/react";
import { Field, Formik } from "formik";
import { Button } from "ui/tailwind";
import { toast } from "react-hot-toast";
import * as Yup from "yup";

const ARR_12 = new Array(12).fill(0);

type LayoutType = "AUDIO" | "VIDEO" | "SCOUT VIDEO" | "SCOUT TEXT";

const setActivePreset = async (
  roomName: string,
  n: SwitchActivePresetAction["activePreset"],
) => {
  const patch: SwitchActivePresetAction = {
    type: "set-active-preset",
    activePreset: n,
    roomName,
  };
  const r = await fetch(`${import.meta.env.VITE_XIMI_SERVER_HOST}/room/state`, {
    method: "PATCH",
    body: JSON.stringify(patch),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await r.json();
};

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
  const [tab, setTab] = useState<LayoutType>("AUDIO");
  const activePreset = roomState?.activePreset || 0;

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
    >
      <div className="relative h-[100%] bg-bg overflow-y-scroll p-0 flex flex-col gap-0">
        <div className="box-border">
          <div className="min-h-[calc(100vh-80px)]">
            {tab === "AUDIO" ? (
              <AudioLayout />
            ) : tab === "VIDEO" ? (
              <div>Video</div>
            ) : tab === "SCOUT VIDEO" ? (
              <div>ScoutVid</div>
            ) : tab === "SCOUT TEXT" ? (
              <div>ScoutText</div>
            ) : (
              <div>Tab error</div>
            )}

            <AudioRenderer />
          </div>
        </div>

        <div className="sticky bottom-0 w-full h-10 px-1 pb-2 border-t bg-bg box-border border-brand">
          <div className="flex items-center justify-between w-full h-full">
            <div className="flex items-center pl-2 gap-2">
              <FaClapperboard />
              <PresetRenamer key={`renamer_slot_${activePreset}`} />
            </div>

            <TabSwitcher tab={tab} setTab={setTab} />
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between border-l bg-bg border-brand">
        <div className="flex flex-col gap-2">
          <nav id="preset_tab">
            {ARR_12.map((_, n) => {
              const className = classNames(
                n === activePreset ? "bg-brand" : "bg-bg",
                n === activePreset ? "text-text" : "text-text/50",
                "border-b",
              );
              return (
                <button
                  type="button"
                  onClick={async () => {
                    const response = await setActivePreset(
                      meta.name,
                      n as SwitchActivePresetAction["activePreset"],
                    );
                    if (response.ok === true) {
                      if (roomState === undefined) {
                        return;
                      }
                      toast(`Switched to ${roomState.presets[n].name}`, {
                        position: "bottom-right",
                        className: "bg-brand/80 text-text rounded-none",
                      });
                    }
                  }}
                  key={`preset_slot_${n}`}
                  className={`relative w-full h-8 flex border-brand items-center justify-center box-border block text-sm hover:bg-brand/70 hover:text-text ${className} [&:hover_span.name-tip]:block`}
                >
                  {n + 1}
                  {activePreset === n && (
                    <span className="absolute top-{50%} left-0 block w-1 h-1 unsaved-indicator bg-white translate-y-{-50%}">
                      &nbsp;
                    </span>
                  )}
                  <span className="hidden absolute w-24 p-1  border name-tip right-[calc(100%+10px)] bg-bg border-brand">
                    {roomState.presets[n].name}
                    <b className="block absolute w-2 h-2 border border-t-0 border-l-0 arrow border-brand right-0 top-[50%] rotate-[-45deg] translate-x-[60%] translate-y-[-50%] bg-bg">
                      {" "}
                    </b>
                  </span>
                </button>
              );
            })}
          </nav>
          <button type="button" className={clsSmallSidebarButton}>
            <FaDownload size={16} />
          </button>

          <button type="button" className={clsSmallSidebarButton}>
            <FaUpload size={16} />
          </button>
        </div>
        <div className="flex flex-col pb-4 gap-2">
          <ChatControl />
          <MicControl />
        </div>
      </div>
    </div>
  );
};

const TabSwitcher: React.FC<{
  tab: LayoutType;
  setTab: React.Dispatch<React.SetStateAction<LayoutType>>;
}> = ({ tab, setTab }) => {
  const layouts: { type: LayoutType; icon: JSX.Element }[] = [
    { type: "AUDIO", icon: <FaVolumeHigh /> },
    { type: "VIDEO", icon: <FaVideo /> },
    { type: "SCOUT VIDEO", icon: <FaEye /> },
    { type: "SCOUT TEXT", icon: <FaA /> },
  ];
  return (
    <nav className="flex h-full border-l gap-0 border-brand relative top-[-1px]">
      {layouts.map((layout) => {
        const cls = classNames([
          tab === layout.type ? "text-text" : "text-accent",
          "leading-4",
          "border-brand",
          "px-4",
          "h-full",
          "text-sm",
          "border",
          "border-l-0",
          "flex",
          "gap-2",
          "items-center",
          tab === layout.type ? "border-t-bg" : "border-t-brand",
        ]);
        return (
          <button
            key={layout.type}
            className={cls}
            type="button"
            onClick={() => {
              setTab(layout.type);
            }}
          >
            {layout.icon}
            <span>{layout.type}</span>
          </button>
        );
      })}
    </nav>
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

const ChatControl = () => {
  const [showChatModal, setShowChatModal] = useState(false);
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();

  useEffect(() => {
    const handleDataReceived = (payload: Uint8Array) => {
      const decoder = new TextDecoder();
      const data = decoder.decode(payload);

      try {
        const payload: MessageDataPayload | undefined = JSON.parse(data);
        if (payload && payload.from) {
          toast(
            <div>
              <h4 className="text-sm font-bold">{payload.from}</h4>
              <p className="text-sm">{payload.message}</p>
            </div>,
            {
              position: "bottom-right",
              className: "bg-bg/80 border-brand border text-text rounded-none",
            },
          );
        }
      } catch (err) {
        toast.error("Error parsing incoming data message", {
          position: "bottom-right",
          className: "bg-negative/80 text-text rounded-none",
        });
      }
    };
    room.on(RoomEvent.DataReceived, handleDataReceived);

    return () => {
      room.off(RoomEvent.DataReceived, handleDataReceived);
    };
  }, [room]);

  const sendMessage = useCallback(
    (text: string) => {
      const encoder = new TextEncoder();
      const data = encoder.encode(
        JSON.stringify({
          from: localParticipant.identity,
          message: text,
        } as MessageDataPayload),
      );
      return localParticipant.publishData(data, DataPacket_Kind.RELIABLE, {});
    },
    [localParticipant],
  );

  return (
    <>
      <Transition show={showChatModal} as={Fragment}>
        <Dialog className="relative" onClose={() => setShowChatModal(false)}>
          <Transition.Child
            as={Fragment}
            enter="transition duration-100 ease-out"
            enterFrom="opacity-0"
            enterTo="opacity-1"
            leave="transition duration-75 ease-out"
            leaveFrom="transform opacity-100"
            leaveTo="transform opacity-0"
          >
            <div className="fixed inset-0 z-10 bg-bg/30">&nbsp;</div>
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-300"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-90"
          >
            <Dialog.Panel className="z-20 w-full max-w-lg p-0 border rounded-md bg-bg border-brand text-text top-[50%] left-[50%] fixed transform translate-x-[-50%] translate-y-[-50%]">
              <Dialog.Title className="py-2 text-xl text-center">
                Send message
              </Dialog.Title>

              <Formik
                initialValues={{
                  message: "",
                }}
                validationSchema={Yup.object({
                  message: Yup.string().required(),
                })}
                validateOnMount={true}
                onSubmit={async ({ message }, { resetForm }) => {
                  await sendMessage(message);

                  toast(
                    <div>
                      <h4 className="text-sm font-bold">
                        {localParticipant.identity}
                      </h4>
                      <p className="text-sm">{message}</p>
                    </div>,
                    {
                      position: "bottom-right",
                      className:
                        "bg-bg/80 border-text border text-text rounded-none",
                    },
                  );
                  resetForm();
                }}
              >
                {({ isValid, submitForm }) => {
                  return (
                    <form
                      className="flex flex-col p-4 gap-4"
                      onSubmit={(e) => {
                        submitForm();
                        e.preventDefault();
                      }}
                    >
                      <Field
                        name="message"
                        className="text-2xl text-center border bg-bg border-grey [&:focus]:border-brand appearance-none outline-none rounded-sm w-full"
                        autoComplete="false"
                      />
                      <div className="flex gap-4">
                        <Button onClick={() => setShowChatModal(false)}>
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          disabled={!isValid}
                          onClick={() => {
                            submitForm();
                          }}
                        >
                          Send
                        </Button>
                      </div>
                    </form>
                  );
                }}
              </Formik>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
      <button
        type="button"
        className={clsSmallSidebarButton}
        onClick={() => {
          setShowChatModal(true);
        }}
      >
        <FaMessage />
      </button>
    </>
  );
};

export { Stage };
