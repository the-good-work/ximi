import React, { Dispatch, useState } from "react";
import Heading from "ui/Texts/Heading";
import {
  ReturnDownBack,
  Backspace,
  ArrowForward,
  CloseCircleOutline,
} from "react-ionicons";
import {
  RoomStateEnterName,
  UpdateStateActions,
} from "../../../../types/performerStates";
import Text from "ui/Texts/Text";
import IconButton from "ui/Buttons/IconButton";
import Input from "ui/Form/Input";
import { styled } from "ui/theme/theme";
import Button from "ui/Buttons/Button";
import { ScreenContainer } from "ui/Composites/ScreenContainer";
import { useToast } from "ui/Feedback/Toast";

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
    gap: "$sm",
  },
});

const HeadingGroup = styled("div", {
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

export default function EnterName({
  updateState,
  state,
}: {
  updateState: Dispatch<UpdateStateActions>;
  state: RoomStateEnterName;
}) {
  const [nickname, setNickname] = useState<string>(
    state.properties.name.length > 0 ? state.properties.name : ""
  );

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

  const { toast } = useToast();

  async function checkNickname(nickname: string) {
    const data = {
      name: nickname,
    };
    const options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_HOST}/rooms/validate-name`,
      options
    );
    return response;
  }

  async function compareNickname(nickname: string) {
    checkNickname(nickname)
      .then((res) => {
        res
          .json()
          .then((r) => {
            if (res.status === 422) {
              if (nickname.length <= 0) {
                toast({
                  title: "Nickname cannot be empty",
                  tone: "warning",
                  jumbo: false,
                });
              } else {
                toast({
                  title: r.error,
                  tone: "warning",
                  jumbo: false,
                });
              }
            } else {
              updateState({
                type: "submit-name",
                properties: {
                  name: nickname,
                },
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
      })
      .catch(() => {
        toast({
          title: "An error has occurred, please try again later",
          tone: "warning",
          jumbo: false,
        });
      });
  }

  const handleNickname = (key: string, nickname: string) => {
    const keyboardKey = key.slice(-1);

    if (key === "Enter" || key === "confirm") {
      compareNickname(nickname);
    } else if (key === "Backspace" || key === "bsp") {
      setNickname(nickname.slice(0, -1).toUpperCase());
    } else if (key === "clr") {
      setNickname(nickname.slice(0, -5).toUpperCase());
    } else if (keys.indexOf(keyboardKey) !== -1) {
      setNickname(`${nickname}${keyboardKey}`.slice(0, 5).toUpperCase());
    } else return;
  };

  return (
    <div className="content noscroll">
      <ScreenContainer
        css={{
          gap: "0",
          ".body": {
            "@base": { gap: "$md" },
            "@md": { gap: "$lg" },
          },
        }}
      >
        <HeadingGroup className="heading">
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
        </HeadingGroup>
        <div className="body">
          <Input
            autoFocus
            readOnly
            css={{
              letterSpacing: "0.5rem",
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
                    icon={<ArrowForward color="inherit" />}
                    type="primary"
                  />
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
                    icon={<CloseCircleOutline color="inherit" />}
                  />
                );
              } else if (k === "bsp") {
                return (
                  <Button
                    variant="keyboard"
                    key={"bsp"}
                    className={"bsp"}
                    css={{ span: { path: { fill: "$text" } } }}
                    onClick={() => {
                      handleNickname("bsp", nickname);
                    }}
                    aria-label="Backspace"
                    icon={<Backspace color="inherit" />}
                  />
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
      </ScreenContainer>
      <IconButton
        onClick={() => {
          updateState({
            type: "back-to-connection-input",
          });
        }}
        css={{
          position: "fixed",
          bottom: "$sm",
          left: "$sm",
          span: { path: { fill: "none" } },
        }}
        iconSize="md"
        variant="outline"
        aria-label={`Back to home`}
        icon={<ReturnDownBack color="inherit" />}
      />
    </div>
  );
}
