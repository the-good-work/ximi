export type Room = {
  name: string;
  id: string;
  noOfParticipants: number;
} | null;

export type Pages = "home" | "select-input" | "enter-password";

export type UpdateStateActions =
  | {
      type: "go-home";
      properties: {};
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
      type: "entered-password";
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
