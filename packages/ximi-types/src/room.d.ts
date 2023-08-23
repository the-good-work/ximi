export type Room = {
  name: string;
  passcode: string;
  participants?: Participant[];
  currentSetting: (
    | ParticipantPerformer
    | ParticipantControl
    | ParticipantScout
  )[];
  currentPreset: string;
  presets: Preset[];
  controlCount?: number;
  outputCount?: number;
};

export type ServerUpdate =
  | RoomUpdatePayload
  | PerformerUpdatePayload
  | ScoutUpdatePayload
  | OutputUpdatePayload
  | MessagePayload
  | PingPayload
  | PongPayload;

export type RoomUpdatePayload = {
  type: "room-update";
  update: Pick<
    Room,
    "participants" | "currentSetting" | "currentPreset" | "presets"
  >;
};

export type PerformerUpdatePayload = {
  type: "performer-update";
  update: ParticipantPerformer;
};

export type ScoutUpdatePayload = {
  type: "scout-update";
  update: ParticipantScout;
};

export type OutputUpdatePayload = {
  type: "output-update";
  update: {
    output: ParticipantOutput;
    performer: ParticipantPerformer;
  };
};

export type MessagePayload = {
  type: "message";
  message: string;
  sender: string;
};

export type PingPayload = {
  type: "ping";
  target: string;
  id: number;
};

export type PongPayload = {
  type: "pong";
  target: string;
  id: number;
};

export type ParticipantMetadata =
  | {
      type: Exclude<Participant["type"], "OUTPUT">;
    }
  | {
      type: Extract<Participant["type"], "OUTPUT">;
      target: string;
    };

export type RoomUpdateAction =
  | {
      type: "MUTE_AUDIO";
      room_name: string;
      participant: string;
      target: string;
    }
  | {
      type: "UNMUTE_AUDIO";
      room_name: string;
      participant: string;
      target: string;
    }
  | {
      type: "UPDATE_DELAY";
      room_name: string;
      participant: string;
      delay: number;
    }
  | {
      type: "UPDATE_LAYOUT";
      room_name: string;
      participant: string;
      layout: VideoLayout;
      slots: Slot[];
    }
  | {
      type: "UPDATE_POSTER_TEXT";
      room_name: string;
      participant: string;
      text: string;
    };

export type RoomPresetRequest =
  | {
      type: "SAVE_PRESET";
      room_name: string;
      preset: Preset;
    }
  | {
      type: "LOAD_PRESET";
      room_name: string;
      index: number;
    }
  | {
      type: "LOAD_PRESET_FILE";
      room_name: string;
      presets: Preset[];
    };

export type Participant =
  | ParticipantPerformer
  | ParticipantScout
  | ParticipantControl
  | ParticipantOutput;

export type ParticipantPerformer = {
  sid: string;
  name: string;
  type: "PERFORMER";
  // participant audio configuration
  audioMixMute: string[]; // participant name
  audioOutDelay: number;
  // participant layout configuration
  video: {
    slots: Slot[];
    layout: VideoLayout;
  };
};

export type ParticipantScout = {
  sid: string;
  name: string;
  type: "SCOUT";
  // participant audio configuration
  audioMixMute: string[]; // participant name
  audioOutDelay: number;
  textPoster: string;
};

export type ParticipantControl = {
  sid: string;
  name: string;
  type: "CONTROL";
  audioMixMute: string[]; // participant name
};

export type ParticipantOutput = {
  sid: string;
  name: string;
  type: "OUTPUT";
  target: string;
};

export type Preset = {
  index: number;
  name: string;
  participants?: (ParticipantScout | ParticipantPerformer)[];
};

export type Slot = {
  size: { w: number; h: number };
  position: { x: number; y: number };
  nickname: string;
};

export type VideoLayout =
  | "Default"
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
