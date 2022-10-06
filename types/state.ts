export type Room = {
  room: string;
  participants: number;
} | null;

export type Screens =
  | "list-room-screen"
  | "select-connection-input-screen"
  | "enter-passcode-screen"
  | "enter-name-screen"
  | "in-session-screen";

export type UpdateStateActions =
  | {
      type: "back-to-list";
    }
  | {
      type: "back-to-connection-input";
    }
  | {
      type: "select-room";
      properties: { room: Room };
    }
  | {
      type: "select-connection-mode";
      properties: {
        inputType: "voice" | "line";
      };
    }
  | {
      type: "submit-passcode";
    }
  | {
      type: "submit-name";
      properties: {
        name: string;
      };
    };

export type RoomStateInit = {
  screen: "list-room-screen";
};

export type RoomStateSelectConnectionInput = {
  screen: "select-connection-input-screen";
  properties: {
    room: Room;
  };
};

export type RoomStateEnterPasscode = {
  screen: "enter-passcode-screen";
  properties: {
    room: Room;
    inputType: "voice" | "line";
  };
};

export type RoomStateEnterName = {
  screen: "enter-name-screen";
  properties: {
    room: Room;
    inputType: "voice" | "line";
  };
};

export type RoomStateInSession = {
  screen: "in-session-screen";
  properties: {
    room: Room;
    inputType: "voice" | "line";
  };
};

export type ReducerStates =
  | RoomStateInit
  | RoomStateSelectConnectionInput
  | RoomStateEnterPasscode
  | RoomStateEnterName
  | RoomStateInSession;
