import { styled } from "ui/theme/theme";
import {
  RoomUpdateAction,
  RoomUpdatePayload,
} from "@thegoodwork/ximi-types/src/room";
import { Participant, Room } from "livekit-client";
import { useEffect, useState } from "react";

type Unpacked<T> = T extends (infer U)[]
  ? U
  : T extends (...args: any[]) => infer U
  ? U
  : T extends Promise<infer U>
  ? U
  : T;

export default function PosterTextPanel({
  room,
  participants,
  participantsSettings,
}: {
  room?: Room;
  participants?: Participant[];
  participantsSettings?: (Unpacked<
    RoomUpdatePayload["update"]["participants"]
  > & { type: "SCOUT" })[];
}) {
  const performers =
    participants && participants?.length > 0
      ? participants.filter((p: Participant) => {
          try {
            const meta = JSON.parse(p.metadata || "");
            return meta?.type === "SCOUT";
          } catch (err) {
            return false;
          }
        })
      : [];

  const [activeScout, setActiveScout] = useState<string>(
    performers?.[0].identity
  );

  const thisScoutSettings = participantsSettings?.find(
    (p) => p.name === activeScout
  );

  const [text, setText] = useState<string>("");

  if (
    !room ||
    !participantsSettings ||
    !participants ||
    thisScoutSettings === undefined
  ) {
    return <></>;
  }

  if (performers.length < 1) {
    return (
      <div
        style={{
          color: "white",
          height: "70vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Awaiting scouts
      </div>
    );
  }

  return (
    <StyledTextPanel>
      <div className="poster-panel">
        <textarea
          key={activeScout}
          value={thisScoutSettings.textPoster}
          // this is jumping because async update https://react.dev/reference/react-dom/components/textarea#my-text-area-caret-jumps-to-the-beginning-on-every-keystroke
          onChange={async (e) => {
            await applyTextPosterSetting(
              room.name,
              activeScout,
              e.target.value
            );
          }}
        />
      </div>
      <div className="select-scout">
        {performers.map((p) => (
          <button
            type="button"
            onClick={() => {
              setActiveScout(() => p.identity);
            }}
            style={{
              background: p.identity === activeScout ? "pink" : "unset",
            }}
          >
            {p.identity}
          </button>
        ))}
      </div>
    </StyledTextPanel>
  );
}

const StyledTextPanel = styled("div", {
  display: "flex",
  boxSizing: "border-box",
  flexDirection: "column",
  width: "100%",
  height: "100%",
  border: "2px solid $brand",
  backgroundColor: "$background",
  padding: "$xs",
  gap: "$sm",

  ".poster-panel": {
    width: "100%",
    height: "calc(100vh - 160px)",
    display: "flex",
    alignItems: "center",
    textarea: {
      display: "block",
      width: "100%",
      lineHeight: "1.4",
      height: "80%",
      background: "transparent",
      color: "$text",
      appearance: "none",
      border: "0",
      padding: "0",
      textAlign: "center",
      fontSize: "$2xl",
      fontFamily: "$rubik",
    },
  },
});

async function applyTextPosterSetting(
  room_name: string,
  participant: string,
  text: string
) {
  const action: RoomUpdateAction & { type: "UPDATE_POSTER_TEXT" } = {
    type: "UPDATE_POSTER_TEXT",
    room_name,
    participant,
    text,
  };

  const response = await fetch(
    `${process.env.REACT_APP_SERVER_HOST}/rooms/apply-setting`,
    {
      method: "PATCH",
      body: JSON.stringify(action),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response;
}
