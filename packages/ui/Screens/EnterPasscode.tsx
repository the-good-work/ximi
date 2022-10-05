import React, { Dispatch, useState } from "react";
import Heading from "ui/Texts/Heading";
import { ReturnDownBack } from "react-ionicons";
import { UpdateStateActions } from "../../../types/state";
import Text from "../Texts/Text";
import IconButton from "../Buttons/IconButton";
import Input from "../Form/Input";
import { styled } from "../theme/theme";
import Button from "../Buttons/Button";

export default function EnterPasscode({
  updateState,
}: {
  updateState: Dispatch<UpdateStateActions>;
}) {
  const [passcode, setPasscode] = useState<string>("");

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
    " ",
    "0",
    " ",
    "bsp",
    "clr",
    "ent",
  ];

  const Keypad = styled("div", {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gridTemplateRows: "repeat(8, 1fr)",

    ".bsp": {
      gridColumnStart: "4",
      gridRowStart: "1",
      gridRowEnd: "4",
    },
    ".clr": {
      gridColumnStart: "4",
      gridRowStart: "4",
      gridRowEnd: "7",
    },
    ".ent": {
      gridColumnStart: "4",
      gridRowStart: "7",
      gridRowEnd: "9",
    },
    ".number": {
      gridRow: "span 2",
    },
    "@base": {
      gap: "$xs",
    },
    "@md": {
      gap: "$md",
    },
  });

  return (
    <div className="content noscroll">
      <Heading
        color="gradient"
        css={{
          textAlign: "center",
          textTransform: "uppercase",
          marginTop: "$sm",
          marginBottom: "$sm",
        }}
      >
        Enter Passcode
      </Heading>
      <Text
        color="white"
        size="sm"
        css={{
          marginBottom: "$3xl",
          maxWidth: "500px",
        }}
      >
        The room is protected by a passcode set by the creator of the room.
      </Text>
      <form
        onSubmit={() => {
          updateState({ type: "submit-passcode" });
        }}
      >
        <label htmlFor="password-input" style={{ display: "none" }}>
          Enter Password
        </label>
        <Input
          name="password-input"
          type="text"
          pattern="[0-9]*"
          inputMode="numeric"
          value={passcode}
          onChange={(e) => {
            const target = e.target as HTMLInputElement;
            setPasscode(target.value.slice(0, 5));
          }}
        />
        <Keypad>
          {keys.map((k) => {
            let className;
            let type;

            if (k != "ent" && k != "clr" && k != "bsp") {
              className = "number";
            } else {
              className = k;
            }

            if (k === "ent") {
              type = "submit";
            } else {
              type = "button";
            }

            return (
              <Button
                variant="keypad"
                key={k}
                className={className}
                type={type}
                onClick={() => {
                  if (k === "clr") {
                    setPasscode(passcode.slice(0, -5));
                  } else if (k === "bsp") {
                    setPasscode(passcode.slice(0, -1));
                  } else if (passcode.length < 5) {
                    setPasscode(`${passcode}${k}`);
                  } else if (k === "ent") {
                    return passcode;
                  }
                }}
              >
                {k}
              </Button>
            );
          })}
        </Keypad>
      </form>

      <IconButton
        onClick={() => {
          updateState({
            type: "back-to-connection-input",
          });
        }}
        css={{ position: "fixed", bottom: "$sm", left: "$sm" }}
        iconSize="md"
        variant="outline"
        aria-label={`Back to home`}
        icon={<ReturnDownBack color="inherit" />}
      />
    </div>
  );
}
