import React, { Dispatch, useState } from "react";
import Heading from "ui/Texts/Heading";
import {
  ReturnDownBack,
  Backspace,
  ArrowForward,
  CloseCircleOutline,
} from "react-ionicons";
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
  const [nickname, setNickname] = useState<string>("");

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
    "Q",
    "W",
    "E",
    "R",
    "T",
    "Y",
    "U",
    "I",
    "O",
    "P",
    "A",
    "S",
    "D",
    "F",
    "G",
    "H",
    "J",
    "K",
    "L",
    "bsp",
    "Z",
    "X",
    "C",
    "V",
    "B",
    "N",
    "M",
    "clr",
    "confirm",
  ];

  function checkNickName(nickname: string) {
    const sameName = "AAAAA";
    if (nickname === sameName) {
      console.log("throw a toast saying 'This name is already in use'");
    } else {
      updateState({
        type: "submit-name",
        properties: {
          name: nickname,
        },
      });
    }
  }

  const handleNickname = (key: string, nickname: string) => {
    const keyboardKey = key.slice(-1);

    if (key === "Enter" || key === "confirm") {
      checkNickName(nickname);
    } else if (key === "Backspace" || key === "bsp") {
      setNickname(nickname.slice(0, -1).toUpperCase());
    } else if (key === "clr") {
      setNickname(nickname.slice(0, -5).toUpperCase());
    } else if (keys.indexOf(keyboardKey) != -1) {
      setNickname(`${nickname}${keyboardKey}`.slice(0, 5).toUpperCase());
    } else return;
  };

  const Keypad = styled("div", {
    display: "grid",
    gridTemplateColumns: "repeat(10, 1fr)",
    gridTemplateRows: "repeat(4, 1fr)",

    ".confirm": {
      gridColumn: "span 2",
    },

    "@base": {
      gap: "$xs",
    },
    "@md": {
      gap: "$md",
    },
  });

  const HeadingGroup = styled("div", {
    maxWidth: "600px",
    marginBottom: "0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    div: {
      width: "100%",

      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },

    "@base": {
      span: {
        maxWidth: "400px",
      },
    },
    "@md": {
      span: {
        maxWidth: "500px",
      },
    },
  });

  const PageContainer = styled("div", {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    maxWidth: "600px",

    "@base": {
      gap: "$sm",
      ".heading": {
        minHeight: "120px",
      },
    },
    "@md": {
      gap: "$xl",
      ".heading": {
        minHeight: "140px",
      },
    },

    ".flex-child": {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  });

  return (
    <div className="content noscroll">
      <PageContainer>
        <HeadingGroup className="flex-child heading">
          <div>
            <Heading
              color="gradient"
              css={{
                textAlign: "center",
                textTransform: "uppercase",
                marginTop: "0",
                marginBottom: "$sm",
              }}
            >
              Enter Nickname
            </Heading>
            <Text color="white" size="sm">
              Choose a 5-letter nickname
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
            type="text"
            value={nickname}
            onKeyDown={(e) => {
              const target = e.code;
              handleNickname(target, nickname);
            }}
          />
        </HeadingGroup>
        <div className="flex-child keypad">
          <Keypad>
            {keys.map((k) => {
              if (k === "confirm") {
                return (
                  <Button
                    variant="keyboard"
                    key={"confirm"}
                    className={"confirm"}
                    onClick={() => {
                      handleNickname("confirm", nickname);
                    }}
                    css={{
                      path: { stroke: "$text", fill: "transparent" },
                    }}
                    aria-label="Submit nickname"
                  >
                    <div aria-hidden="true">
                      <ArrowForward color="inherit" />
                    </div>
                  </Button>
                );
              } else if (k === "clr") {
                return (
                  <Button
                    css={{
                      path: { stroke: "$text", fill: "transparent" },
                    }}
                    variant="keyboard"
                    key={"clr"}
                    className={"clr"}
                    onClick={() => {
                      handleNickname("clr", nickname);
                    }}
                    aria-label="Clear nickname"
                  >
                    <div aria-hidden="true">
                      <CloseCircleOutline color="inherit" />
                    </div>
                  </Button>
                );
              } else if (k === "bsp") {
                return (
                  <Button
                    variant="keyboard"
                    key={"bsp"}
                    className={"bsp"}
                    onClick={() => {
                      handleNickname("bsp", nickname);
                    }}
                    aria-label="Backspace"
                  >
                    <div aria-hidden="true">
                      <Backspace color="inherit" />
                    </div>
                  </Button>
                );
              } else
                return (
                  <Button
                    variant="keyboard"
                    key={k}
                    className={"key"}
                    onClick={() => {
                      handleNickname(k, nickname);
                    }}
                  >
                    {k}
                  </Button>
                );
            })}
          </Keypad>
        </div>
      </PageContainer>
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
