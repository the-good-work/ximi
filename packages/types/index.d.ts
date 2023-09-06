type XIMIRole = "PERFORMER" | "SCOUT" | "CONTROL" | "OUTPUT";

type PresetIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

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

interface XimiRoomState {
  passcode: string;
  activePreset: SwitchActivePresetAction["activePreset"];
  presets: Preset[];
}

interface XimiParticipantState {
  role: XIMIRole;
}

interface Preset {
  name: string;
  participants: Record<
    string,
    { identity: string; state: XimiParticipantState }
  >;
}

export {
  XIMIRole,
  PresetIndex,
  SwitchActivePresetAction,
  SetPresetNameAction,
  XimiRoomState,
};
