import { styled } from "@stitches/react";
import React, { Dispatch } from "react";
import Heading from "ui/Texts/Heading";
import { MicOutline, PulseOutline, ReturnDownBack } from "react-ionicons";
import Button from "../Buttons/Button";
import { UpdateStateActions } from "../../../types/state";
import Text from "../Texts/Text";
import IconButton from "../Buttons/IconButton";

export default function SelectInput({
  updateState,
}: {
  updateState: Dispatch<UpdateStateActions>;
}) {
  const ButtonGroup = styled("div", {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexDirection: "row",
    gap: "$3xl",
    width: "100%",
    maxWidth: "650px",
    ".button-and-text": {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      flexDirection: "column",
      gap: "$lg",
      width: "100%",
    },
  });

  return (
    <div className="content">
      <Heading
        color="gradient"
        css={{
          textAlign: "center",
          textTransform: "uppercase",
          marginTop: "$sm",
          marginBottom: "$sm",
        }}
      >
        Connection Mode
      </Heading>
      <Text
        color="white"
        size="sm"
        css={{
          marginBottom: "$3xl",
          maxWidth: "500px",
        }}
      >
        Choose your mode of audio connection to the room
      </Text>

      <ButtonGroup>
        <div className="button-and-text">
          <Button
            onClick={() => {
              updateState({
                type: "connection-mode-selected",
                properties: { inputType: "voice" },
              });
            }}
            css={{
              path: { fill: "none" },
              fontWeight: "$medium",
              textTransform: "uppercase",
            }}
            icon={<MicOutline color="inherit" />}
          >
            Voice Input
          </Button>
          <Text css={{ textAlign: "left" }}>
            Best for microphone input sources. Noise cancellation is applied.
          </Text>
        </div>
        <div className="button-and-text">
          <Button
            css={{
              path: { fill: "none" },
              textTransform: "uppercase",
              fontWeight: "$medium",
            }}
            icon={<PulseOutline color="inherit" />}
            onClick={() => {
              updateState({
                type: "connection-mode-selected",
                properties: { inputType: "line" },
              });
            }}
          >
            Line Input
          </Button>
          <Text css={{ textAlign: "left" }}>
            Best for audio input sources from a clean signal. Audio is not
            post-processed in any way.
          </Text>
        </div>
      </ButtonGroup>
      <IconButton
        onClick={() => {
          updateState({
            type: "go-home",
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
