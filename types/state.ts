export type Room = {
  name: string;
  id: string;
  noOfParticipants: number;
} | null;

export type Pages =
  | "list-room-page"
  | "select-connection-input-page"
  | "enter-passcode-page"
  | "enter-name-page"
  | "in-session-page";

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
  page: "list-room-page";
};

export type RoomStateSelectConnectionInput = {
  page: "select-connection-input-page";
  properties: {
    room: Room;
  };
};

export type RoomStateEnterPasscode = {
  page: "enter-passcode-page";
  properties: {
    room: Room;
    inputType: "voice" | "line";
  };
};

export type RoomStateEnterName = {
  page: "enter-name-page";
  properties: {
    room: Room;
    inputType: "voice" | "line";
  };
};

export type RoomStateInSession = {
  page: "in-session-page";
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
