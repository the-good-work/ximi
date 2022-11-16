import { styled } from "@stitches/react";
import { Dispatch } from "react";
import { ArrowForward, Backspace, CloseCircleOutline } from "react-ionicons";
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
  "clr",
  "confirm",
];

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

export default function MessageModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<boolean>;
}) {
  return open ? (
    <>
      <ModalOverlay
        onClick={() => {
          setOpen(false);
        }}
      />
      <ModalContent>
        <Input
          onKeyDown={(e) => {
            console.log(e.key);
            if (e.key === "Escape") {
              setOpen(false);
            }
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
                      // handleNickname("confirm", nickname);
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
                      //handleNickname("clr", nickname);
                    }}
                    aria-label="Clear nickname"
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
                      //handleNickname("bsp", nickname);
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
                      //handleNickname(k, nickname);
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
});
