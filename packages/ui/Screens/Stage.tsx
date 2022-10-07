import React, { Dispatch } from "react";
import Heading from "ui/Texts/Heading";
import { ReturnDownBack } from "react-ionicons";
import { UpdateStateActions } from "../../../types/state";
import IconButton from "../Buttons/IconButton";

export default function Stage({
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
        Stage
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
