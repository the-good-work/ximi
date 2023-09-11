type XIMIRole = "PERFORMER" | "SCOUT" | "CONTROL" | "OUTPUT";

type PresetIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

type ParticipantIdentity = string;

type VideoLayout = {} | null;

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

interface XimiRoomState {
  passcode: string;
  activePreset: SwitchActivePresetAction["activePreset"];
  presets: Preset[];
}

interface XimiParticipantState {
  role: XIMIRole;
  audio: { mute: ParticipantIdentity[] };
  video: { layout: VideoLayout };
}

interface Preset {
  name: string;
  participants: Record<
    string,
    { identity: string; state: XimiParticipantState }
  >;
}

interface MessageDataPayload {
  from: string;
  message: string;
}

export {
  XIMIRole,
  PresetIndex,
  SwitchActivePresetAction,
  SetPresetNameAction,
  MuteAudioAction,
  UnmuteAudioAction,
  XimiRoomState,
  XimiParticipantState,
  MessageDataPayload,
};
