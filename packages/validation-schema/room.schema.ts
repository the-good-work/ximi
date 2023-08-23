import * as Yup from "yup";

export const createRoomSchema = Yup.object({
  roomName: Yup.string()
    .required("required")
    .matches(/^[0-9a-zA-Z]+$/, "digits and alphabets only")
    .max(10, "max 10 characters")
    .min(2, "min 2 characters"),
  passcode: Yup.string()
    .required("required")
    .matches(/^[0-9]*$/, "digits only")
    .max(5, "must be 5 digits")
    .min(5, "must be 5 digits"),
})
  .required()
  .noUnknown();
