import React, { Dispatch, useState } from "react";
import Heading from "ui/Texts/Heading";
import { ReturnDownBack } from "react-ionicons";
import { UpdateStateActions } from "../../../types/state";
import Text from "../Texts/Text";
import IconButton from "../Buttons/IconButton";
import Input from "../Form/Input";
import { styled } from "../theme/theme";
import Button from "../Buttons/Button";

export default function EnterName({
  updateState,
}: {
  updateState: Dispatch<UpdateStateActions>;
}) {
  const [name, setName] = useState<string>("");

  const keys = [
    "q",
    "w",
    "e",
    "r",
    "t",
    "y",
    "u",
    "i",
    "o",
    "p",
    "a",
    "s",
    "d",
    "f",
    "g",
    "h",
    "j",
    "k",
    "l",
    "bsp",
    "z",
    "x",
    "c",
    "v",
    "b",
    "n",
    "m",
    "clr",
    "confirm",
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
    ".confirm": {
      gridColumnStart: "4",
      gridRowStart: "7",
      gridRowEnd: "9",
    },
    ".letter": {
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
        Enter Nickname
      </Heading>
      <Text
        color="white"
        size="sm"
        css={{
          marginBottom: "$3xl",
          maxWidth: "500px",
        }}
      >
        Choose a 5-letter nickname
      </Text>
      <form
        onSubmit={() => {
          updateState({ type: "submit-name", properties: { name: "test" } });
        }}
      >
        <label htmlFor="name-input" style={{ display: "none" }}>
          Enter Name
        </label>
        <Input
          name="name-input"
          type="text"
          pattern="[0-9]*"
          inputMode="numeric"
          value={name}
          onChange={(e) => {
            const target = e.target as HTMLInputElement;
            setName(target.value.slice(0, 5));
          }}
        />
        <Keypad>
          {keys.map((k) => {
            let className;
            let type;

            if (k != "confirm" && k != "clr" && k != "bsp") {
              className = "letter";
            } else {
              className = k;
            }

            if (k === "confirm") {
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
                    setName(name.slice(0, -5));
                  } else if (k === "bsp") {
                    setName(name.slice(0, -1));
                  } else if (name.length < 5) {
                    setName(`${name}${k}`);
                  } else if (k === "confirm") {
                    return;
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
