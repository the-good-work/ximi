import React, { Dispatch, useState } from "react";
import Heading from "ui/Texts/Heading";
import { ReturnDownBack } from "react-ionicons";
import { UpdateStateActions } from "../../../types/state";
import Text from "../Texts/Text";
import IconButton from "../Buttons/IconButton";
import Input from "../Form/Input";

export default function EnterPasscode({
  updateState,
}: {
  updateState: Dispatch<UpdateStateActions>;
}) {
  const [passcode, setPasscode] = useState<string>("");

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
      <form>
        <label htmlFor="password-input">Enter Password</label>
        <Input
          name="password-input"
          type="password"
          pattern="[0-9]*"
          inputMode="numeric"
          value={passcode}
          onChange={(e) => {
            const target = e.target as HTMLInputElement;
            setPasscode(target.value.slice(0, 5));
          }}
        />
      </form>
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
