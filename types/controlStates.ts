export type Room = {
  room: string;
  participants: number;
} | null;

export type InputTypes = "voice" | "line";

export type Screens =
  | "room-list-screen"
  | "create-room-screen"
  | "join-room-screen"
  | "stage-screen";

export type UpdateStateActions =
  | {
      type: "back-to-list";
    }
  | {
      type: "select-room";
      room: Room;
    }
  | {
      type: "submit-passcode";
      token: string;
    }
  | {
      type: "create-room";
    }
  | {
      type: "confirm-create-room";
      room: Room;
      token: string;
    };

export type RoomStateInit = {
  screen: "room-list-screen";
};

export type RoomStateCreate = {
  screen: "create-room-screen";
};
export type RoomStateJoin = {
  screen: "join-room-screen";
  room: Room;
};

export type RoomStateStage = {
  screen: "stage-screen";
  room: Room;
  token: string;
};

export type ReducerStates =
  | RoomStateInit
  | RoomStateCreate
  | RoomStateJoin
  | RoomStateStage;
