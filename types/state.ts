export type Room = {
  name: string;
  id: string;
  noOfParticipants: number;
} | null;

export type Pages = "home" | "select-input" | "enter-password";

export type UpdateStateActions =
  | {
      type: "enter-room";
      properties: { room: Room; isFullscreen: boolean };
    }
  | {
      type: "select-connection-mode";
      properties: {
        inputType: "voice" | "line";
        isFullScreen: boolean;
      };
    }
  | {
      type: "go-home";
      properties: {
        isFullScreen: boolean;
      };
    };

export type RoomStateInit = {
  page: "home";
  properties: {
    room: null;
    rooms: Room[];
  };
};

export type RoomStateSelectInput = {
  page: "select-input";
  properties: {
    room: Room;
  };
};

export type RoomStateEnterPassword = {
  page: "enter-password";
  properties: {
    room: Room;
    inputType: "voice" | "line";
  };
};

export type ReducerStates =
  | RoomStateInit
  | RoomStateSelectInput
  | RoomStateEnterPassword;
