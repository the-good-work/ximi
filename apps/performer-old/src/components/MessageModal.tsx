import { styled } from "@stitches/react";
import { Dispatch, useState } from "react";
import { ArrowForward, Backspace } from "react-ionicons";
import Button from "ui/Buttons/Button";
import Input from "ui/Form/Input";

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
  "space",
  "confirm",
];

const Keypad = styled("div", {
  display: "grid",
  gridTemplateColumns: "repeat(10, 1fr)",
  gridTemplateRows: "repeat(4, 1fr)",
  gap: "$2xs",

  ".confirm": {
    gridColumn: "span 2",
  },
});

export default function MessageModal({
  open,
  setOpen,
  sendMessage,
}: {
  open: boolean;
  setOpen: Dispatch<boolean>;
  sendMessage: (message: string) => void;
}) {
  const [messageInput, setMessageInput] = useState("");
  const inputElem = document.getElementById("message-input");

  return open ? (
    <>
      <ModalOverlay
        onClick={() => {
          setOpen(false);
        }}
      />
      <ModalContent>
        <Input
          id="message-input"
          autoFocus={true}
          value={messageInput}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false);
              setMessageInput("");
            } else if (e.key === "Enter" || e.key === "Return") {
              const _msg = messageInput;
              if (_msg.length) {
                sendMessage(_msg);
              }
              setMessageInput("");
              inputElem?.focus();
            }
          }}
          onChange={(e) => {
            setMessageInput(e.target.value);
          }}
        />
        <div id="keys">
          <Keypad>
            {keys.map((k) => {
              if (k === "confirm") {
                return (
                  <Button
                    variant="keyboard"
                    key={"confirm"}
                    className={"confirm"}
                    onClick={() => {
                      const _msg = messageInput;
                      if (_msg.length) {
                        sendMessage(_msg);
                      }
                      setMessageInput("");
                      inputElem?.focus();
                    }}
                    css={{
                      path: { stroke: "$text", fill: "transparent" },
                    }}
                    aria-label="Submit nickname"
                    icon={<ArrowForward color="inherit" />}
                    type="primary"
                  />
                );
              } else if (k === "space") {
                return (
                  <Button
                    css={{
                      path: { stroke: "$text", fill: "transparent" },
                    }}
                    variant="keyboard"
                    key={"space"}
                    className={"space"}
                    onClick={() => {
                      setMessageInput((msg) => `${msg}${` `}`);
                      inputElem?.focus();
                    }}
                    aria-label="Space"
                    icon={` `}
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
                      setMessageInput((msg) =>
                        msg.substring(0, msg.length - 1)
                      );
                      inputElem?.focus();
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
                      setMessageInput((msg) => `${msg}${k}`);
                      inputElem?.focus();
                    }}
                  >
                    {k}
                  </Button>
                );
            })}
          </Keypad>
        </div>
      </ModalContent>
    </>
  ) : null;
}

const ModalOverlay = styled("div", {
  background: "$accent-translucent",
  width: "100%",
  height: "100%",
  position: "fixed",
  zIndex: 3000,
  top: 0,
  left: 0,
});

const ModalContent = styled("div", {
  background: "transparent",
  position: "fixed",
  transform: "translate(-50%, -50%)",
  zIndex: 3001,
  top: "50%",
  left: "50%",
  display: "flex",
  flexDirection: "column",
  gap: "$xs",

  input: {
    boxSizing: "border-box",
    padding: "$2xs",
  },
});
