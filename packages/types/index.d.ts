type XIMIRole = "PERFORMER" | "SCOUT" | "CONTROL" | "OUTPUT";

type PresetIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

type ParticipantIdentity = string;

type GridAreaString = string;
type VideoLayoutName =
  | "Auto"
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K";

type VideoLayout = {
  name: VideoLayoutName;
  layout: { identity: string; layout: GridAreaString }[] | undefined;
};

interface RoomAction {
  roomName: string;
}

interface SwitchActivePresetAction extends RoomAction {
  type: "set-active-preset";
  activePreset: PresetIndex;
}

interface SetPresetNameAction extends RoomAction {
  type: "set-preset-name";
  preset: PresetIndex;
  name: string;
}

interface MuteAudioAction extends RoomAction {
  type: "mute-audio";
  channel: string;
  forParticipant: string;
}

interface UnmuteAudioAction extends RoomAction {
  type: "unmute-audio";
  channel: string;
  forParticipant: string;
}

interface SetAudioDelayAction extends RoomAction {
  type: "set-audio-delay";
  forParticipant: string;
  delay: number;
}

interface SetVideoLayoutAction extends RoomAction {
  type: "set-video-layout";
  forParticipant: string;
  layout: VideoLayout;
}

interface UploadPresetsAction extends RoomAction {
  type: "upload-presets";
  roomState: XimiRoomState;
}

interface SetScoutTextAction extends RoomAction {
  type: "set-scout-text";
  forParticipant: string[];
  textPoster: string;
}

interface XimiRoomState {
  passcode: string;
  activePreset: SwitchActivePresetAction["activePreset"];
  presets: Preset[];
}

interface XimiParticipantState {
  role: XIMIRole;
  audio: { mute: ParticipantIdentity[]; delay: number };
  video: VideoLayout;
  textPoster: string;
}

interface Preset {
  name: string;
  participants: Record<
    string,
    { identity: string; state: XimiParticipantState }
  >;
}

interface MessageDataPayload {
  type: "message";
  from: string;
  message: string;
}

interface PingDataPayload {
  type: "ping";
  id: string;
  sender: string;
}

interface PongDataPayload {
  type: "pong";
  id: string;
}

MessageDataPayload | PingDataPayload | PongPayload;

export {
  XIMIRole,
  PresetIndex,
  SwitchActivePresetAction,
  SetPresetNameAction,
  MuteAudioAction,
  UnmuteAudioAction,
  SetVideoLayoutAction,
  SetAudioDelayAction,
  SetScoutTextAction,
  UploadPresetsAction,
  XimiRoomState,
  XimiParticipantState,
  MessageDataPayload,
  PingDataPayload,
  PongDataPayload,
};
