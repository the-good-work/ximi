import * as Yup from "yup";

// @ts-ignore
const hostname = (import.meta as any)?.env?.VITE_XIMI_SERVER_HOST || "/";

const createRoomSchema = Yup.object({
  roomName: Yup.string()
    .required("required")
    .matches(/^[0-9a-zA-Z]+$/, "digits and alphabets only")
    .max(10, "max 10 characters")
    .min(2, "min 2 characters")
    .test("checkRoomUnique", "This room name already exists", async (value) => {
      try {
        const r = await fetch(`${hostname}/room/${value}/exists`);
        const result = await r.json();
        return !result as boolean;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }),
  passcode: Yup.string()
    .required("required")
    .matches(/^[0-9]*$/, "digits only")
    .max(5, "must be 5 digits")
    .min(5, "must be 5 digits"),
})
  .required()
  .noUnknown();

const joinRoomSchemaForRoom = (roomName: string) =>
  Yup.object({
    roomName: Yup.string()
      .required("required")
      .matches(/^[0-9a-zA-Z]+$/, "digits and alphabets only")
      .max(10, "max 10 characters")
      .min(2, "min 2 characters")
      .equals([roomName])
      .test("checkRoomExists", "This room does not exist", async (value) => {
        try {
          const r = await fetch(`${hostname}/room/${value}/exists`);
          const result = await r.json();
          return result as boolean;
        } catch (err) {
          console.warn(err);
          return false;
        }
      }),

    passcode: Yup.string()
      .required("required")
      .matches(/^[0-9]*$/, "digits only")
      .max(5, "must be 5 digits")
      .min(5, "must be 5 digits"),

    identity: Yup.string()
      .required("identity required")
      .matches(/^[0-9a-zA-Z]+$/, "digits and alphabets only")
      .max(10, "max 10 characters")
      .min(2, "min 2 characters")
      .test(
        "checkIdentityAvailable",
        "This identity is already in the room",
        async (value) => {
          try {
            const r = await fetch(
              `${hostname}/room/${roomName}/identity/${value}/exists`,
            );
            const result = await r.json();
            return !result as boolean;
          } catch (err) {
            console.warn(err);
            return false;
          }
        },
      ),
  })
    .required()
    .noUnknown();

export { joinRoomSchemaForRoom, createRoomSchema };
