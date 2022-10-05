export type Room = {
  name: string;
  id: string;
  noOfParticipants: number;
} | null;

export type Pages = "home" | "select-input" | "enter-passcode";

export type UpdateStateActions =
  | {
      type: "go-home";
    }
  | {
      type: "room-selected";
      properties: { room: Room };
    }
  | {
      type: "connection-mode-selected";
      properties: {
        inputType: "voice" | "line";
      };
    }
  | {
      type: "entered-passcode";
      properties: {};
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

export type RoomStateEnterPasscode = {
  page: "enter-passcode";
  properties: {
    room: Room;
    inputType: "voice" | "line";
  };
};

export type ReducerStates =
  | RoomStateInit
  | RoomStateSelectInput
  | RoomStateEnterPasscode;
