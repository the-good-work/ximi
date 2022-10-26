import React, { Dispatch, useState } from "react";
import Heading from "ui/Texts/Heading";
import { ReturnDownBack, ReturnDownForward } from "react-ionicons";
import {
  RoomStateJoin,
  UpdateStateActions,
} from "../../../../types/controlStates";
import Text from "ui/Texts/Text";
import Input from "ui/Form/Input";
import { ScreenContainer } from "ui/Composites/ScreenContainer";
import Button from "ui/Buttons/Button";
import { styled } from "ui/theme/theme";
import { useToast } from "ui/Feedback/Toast";

export default function JoinRoom({
  updateState,
  state,
}: {
  updateState: Dispatch<UpdateStateActions>;
  state: RoomStateJoin;
}) {
  const [passcode, setPasscode] = useState<string>("");
  const { toast } = useToast();

  const keys = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0",
    "clr",
    "bsp",
    "ent",
  ];

  async function checkPasscode(pass: string) {
    const data = {
      room_name: state.room?.room,
      participant_name: state.name,
      participant_type: "CONTROL",
      passcode: pass,
    };
    const options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_HOST}/rooms/validate-passcode`,
      options
    );
    return response;
  }

  async function comparePasscode(pass: string) {
    checkPasscode(pass)
      .then((res) => {
        if (res.status === 200) {
          res
            .text()
            .then((r) => {
              updateState({
                type: "submit-passcode",
                token: r,
              });
            })
            .catch(() => {
              toast({
                title: "An error has occurred, please try again later",
                tone: "warning",
                jumbo: false,
              });
            });
        } else {
          res
            .json()
            .then((r) => {
              if (passcode.length <= 0) {
                toast({
                  title: "Please enter passcode",
                  tone: "warning",
                  jumbo: false,
                });
              } else {
                toast({
                  title: r.message,
                  tone: "warning",
                  jumbo: false,
                });
              }
            })
            .catch(() => {
              toast({
                title: "An error has occurred, please try again later",
                tone: "warning",
                jumbo: false,
              });
            });
        }
      })
      .catch(() => {
        toast({
          title: "An error has occurred, please try again later",
          tone: "warning",
          jumbo: false,
        });
      });
  }

  const handlePasscode = (key: string, pass: string) => {
    const numberKey = key.slice(-1);

    if (key === "Enter" || key === "ent") {
      comparePasscode(pass);
    } else if (key === "Backspace" || key === "bsp") {
      setPasscode(passcode.slice(0, -1));
    } else if (key === "clr") {
      setPasscode(passcode.slice(0, -5));
    } else if (keys.indexOf(numberKey) !== -1) {
      setPasscode(`${passcode}${numberKey}`.slice(0, 5));
    } else return;
  };

  const Group = styled("div", {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "$lg",

    ".button-group": {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      gap: "$lg",
      flexDirection: "row",
    },
  });

  return (
    <div className="content noscroll">
      <ScreenContainer>
        <Group
          className="heading"
          css={{
            div: {
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            },
          }}
        >
          <div>
            <Heading
              color="gradient"
              css={{
                textAlign: "center",
                textTransform: "uppercase",
                marginTop: "$sm",
                marginBottom: "$sm",
              }}
            >
              Join Room: {state.room?.room || ""}
            </Heading>
            <Text
              color="white"
              size="sm"
              css={{ textTransform: "uppercase", fontWeight: "$medium" }}
            >
              Passcode (5-digits)
            </Text>
          </div>
          <Input
            onKeyDown={(e) => {
              const target = e.code;
              handlePasscode(target, passcode);
            }}
            value={passcode}
            pattern="[0-9]*"
            maxLength={"5"}
            inputMode="numeric"
            autoFocus
            css={{
              letterSpacing: "1rem",
              fontSize: "$2xl",
              maxWidth: "450px",
            }}
            type="password"
          />
          <div className="button-group">
            <Button
              onClick={() => {
                updateState({
                  type: "back-to-list",
                });
              }}
              css={{ path: { fill: "transparent" }, justifyContent: "center" }}
              icon={<ReturnDownBack color="inherit" />}
            >
              Back
            </Button>
            <Button
              type="primary"
              onClick={() => {
                handlePasscode("ent", passcode);
              }}
              css={{ path: { fill: "transparent" }, justifyContent: "center" }}
              icon={<ReturnDownForward color="inherit" />}
            >
              Confirm
            </Button>
          </div>
        </Group>
      </ScreenContainer>
    </div>
  );
}
