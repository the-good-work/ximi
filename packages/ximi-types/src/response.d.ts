export type ErrorType =
  | "ROOM_MAX"
  | "ROOM_EXIST"
  | "NICKNAME_EXIST"
  | "INCORRECT_PASSCODE"
  | "ROOM_NOT_EXIST"
  | "CREATE_ROOM_INVALID"
  | "PARTICIPANT_NAME_EXIST"
  | "PARTICIPANT_NAME_INVALID";

export type ApiPayload = SuccessPayload | ErrorPayload;

type SuccessPayload = { status: "success"; message: string; data?: any };
type ErrorPayload = { status: "error"; error: string };
