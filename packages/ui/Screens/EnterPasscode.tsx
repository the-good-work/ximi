import React, { Dispatch, useState } from "react";
import Heading from "ui/Texts/Heading";
import {
  ReturnDownBack,
  ArrowForward,
  Backspace,
  CloseCircleOutline,
} from "react-ionicons";
import { UpdateStateActions } from "../../../types/state";
import Text from "../Texts/Text";
import IconButton from "../Buttons/IconButton";
import Input from "../Form/Input";
import { ScreenContainer } from "../Composites/ScreenContainer";
import Button from "../Buttons/Button";
import { styled } from "../theme/theme";

export default function EnterPasscode({
  updateState,
}: {
  updateState: Dispatch<UpdateStateActions>;
}) {
  const parentPasscode = "11111";
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
    "0",
    "clr",
    "bsp",
    "ent",
  ];

  function comparePasscode(passcode: string) {
    if (passcode === parentPasscode) {
      updateState({ type: "submit-passcode" });
    }
  }

  const handlePasscode = (key: string, pass: string) => {
    const numberKey = key.slice(-1);

    if (key === "Enter" || key === "ent") {
      comparePasscode(pass);
    } else if (key === "Backspace" || key === "bsp") {
      setPasscode(passcode.slice(0, -1));
    } else if (key === "clr") {
      setPasscode(passcode.slice(0, -5));
    } else if (keys.indexOf(numberKey) != -1) {
      setPasscode(`${passcode}${numberKey}`.slice(0, 5));
    } else return;
  };

  const Keypad = styled("div", {
    display: "grid",
    gap: "0",
    gridTemplateColumns: "repeat(4, 1fr)",
    gridTemplateRows: "repeat(4, 1fr)",

    ".clr": {
      gridColumn: "3",
      gridRow: "4",
    },
    ".bsp": {
      gridColumnStart: "4",
      gridRowStart: "1",
      gridRowEnd: "3",
    },
    ".ent": {
      gridColumnStart: "4",
      gridRowStart: "3",
      gridRowEnd: "5",
    },
    ".zero": {
      gridColumn: "span 2",
    },
    ".number": {
      gridRow: "span 1",
    },
    "@base": {
      gap: "$xs",
    },
    "@md": {
      gap: "$md",
    },
  });

  const HeadingGroup = styled("div", {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  });

  return (
    <div className="content noscroll">
      <ScreenContainer>
        <HeadingGroup
          className="heading"
          css={{
            div: {
              width: "100%",
              display: passcode.length > 0 ? "none" : "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            },
            input: {
              position: passcode.length > 0 ? "static" : "fixed",
              top: passcode.length > 0 ? "unset" : "-3000px",
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
              Enter Passcode
            </Heading>
            <Text color="white" size="sm">
              The room is protected by a passcode set by the creator of the
              room.
            </Text>
          </div>
          <Input
            autoFocus
            readOnly
            css={{
              letterSpacing: "1rem",
              fontSize: "$2xl",
              maxWidth: "450px",
            }}
            type="password"
            value={passcode}
            onKeyDown={(e) => {
              const target = e.code;
              handlePasscode(target, passcode);
            }}
          />
        </HeadingGroup>

        <div className="flex-child content">
          <Keypad>
            {keys.map((k) => {
              if (k === "ent") {
                return (
                  <Button
                    variant="keypad"
                    type="primary"
                    key={"ent"}
                    className={"ent"}
                    onClick={() => {
                      handlePasscode("ent", passcode);
                    }}
                    css={{
                      path: { stroke: "$text", fill: "transparent" },
                    }}
                    aria-label="Submit passcode"
                    icon={<ArrowForward color="inherit" />}
                  />
                );
              } else if (k === "clr") {
                return (
                  <Button
                    css={{
                      path: { stroke: "$text", fill: "transparent" },
                    }}
                    variant="keypad"
                    key={"clr"}
                    className={"clr"}
                    onClick={() => {
                      handlePasscode("clr", passcode);
                    }}
                    aria-label="Clear passcode"
                    icon={<CloseCircleOutline color="inherit" />}
                  />
                );
              } else if (k === "bsp") {
                return (
                  <Button
                    variant="keypad"
                    key={"bsp"}
                    className={"bsp"}
                    onClick={() => {
                      handlePasscode("bsp", passcode);
                    }}
                    aria-label="Backspace"
                    icon={<Backspace color="inherit" />}
                  />
                );
              } else if (k === "0") {
                return (
                  <Button
                    variant="keypad"
                    key={k}
                    className={"zero"}
                    onClick={() => {
                      handlePasscode(k, passcode);
                    }}
                  >
                    {k}
                  </Button>
                );
              } else
                return (
                  <Button
                    variant="keypad"
                    key={k}
                    className={"number"}
                    onClick={() => {
                      handlePasscode(k, passcode);
                    }}
                  >
                    {k}
                  </Button>
                );
            })}
          </Keypad>
        </div>
      </ScreenContainer>
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
