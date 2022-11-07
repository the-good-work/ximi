export type PanelStates = "audio" | "video";

export type Preset = {
  name: string;
  saved: boolean;
  index: number;
};

export type PresetAction = {
  type: "update-preset";
  name: string;
  saved: boolean;
  index: number;
};
