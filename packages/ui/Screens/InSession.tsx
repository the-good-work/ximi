import { styled } from "@stitches/react";
import React, { Dispatch } from "react";
import Heading from "ui/Texts/Heading";
import { MicOutline, PulseOutline, ReturnDownBack } from "react-ionicons";
import Button from "../Buttons/Button";
import { UpdateStateActions } from "../../../types/state";
import Text from "../Texts/Text";
import IconButton from "../Buttons/IconButton";

export default function InSession({
  updateState,
}: {
  updateState: Dispatch<UpdateStateActions>;
}) {
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
        In Session
      </Heading>

      <IconButton
        onClick={() => {
          updateState({
            type: "back-to-list",
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
