import { styled } from "ui/theme/theme";
import {
  RoomUpdateAction,
  RoomUpdatePayload,
} from "@thegoodwork/ximi-types/src/room";
import { Participant, Room } from "livekit-client";
import { useCallback, useEffect, useState } from "react";
import Text from "ui/Texts/Text";

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
    performers?.[0]?.identity || ""
  );

  const thisScoutSettings = participantsSettings?.find(
    (p) => p.name === activeScout
  );

  const [text, setText] = useState<string>("");
  const [savingText, setSavingText] = useState<boolean>(false);

  useEffect(() => {
    if (room?.name === undefined) {
      return;
    }
    const timeoutId = setTimeout(() => {
      if (text !== thisScoutSettings?.textPoster) {
        setSavingText(() => true);
        applyTextPosterSetting(room.name, activeScout, text)
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            setSavingText(() => false);
          });
      }
    }, 200);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [text, activeScout, thisScoutSettings?.textPoster, room?.name]);

  useEffect(() => {
    if (typeof thisScoutSettings?.textPoster === "string") {
      setText(() => thisScoutSettings.textPoster);
    }
  }, [activeScout, thisScoutSettings?.textPoster]);

  const setAllText = useCallback(() => {
    console.log(room?.name);
    if (!room?.name) {
      return;
    }
    const promises = performers.map((p) => {
      return !!p.identity
        ? applyTextPosterSetting(room.name, p.identity, text)
        : null;
    });
    console.log(promises);
    return Promise.all(promises);
  }, [text, performers, room?.name]);

  if (
    !room ||
    !participantsSettings ||
    !participants ||
    thisScoutSettings === undefined
  ) {
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
        <div className="text-input">
          <div className="textarea-mirror">
            {thisScoutSettings.textPoster}&#8203;
          </div>
          <textarea
            placeholder="Start typing"
            key={activeScout}
            style={{ resize: "none" }}
            value={text}
            onChange={async (e) => {
              setText(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="select-scout">
        {performers.map((p) => (
          <ScoutButton
            type="button"
            disabled={savingText}
            className={`${p.identity === activeScout ? "active" : ""}`}
            key={p.identity}
            onClick={() => {
              setActiveScout(() => p.identity);
            }}
          >
            <Text size="xs">{p.identity}</Text>
          </ScoutButton>
        ))}
        <span className="sep"> </span>
        <ScoutButton
          type="button"
          disabled={savingText}
          onClick={async () => {
            console.log("hey");
            await setAllText();
          }}
        >
          <Text size="2xs">Apply to All Units</Text>
        </ScoutButton>
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

    ".text-input": {
      position: "relative",
      width: "100%",

      textarea: {
        display: "block",
        width: "100%",
        height: "100%",
        background: "transparent",
        color: "$text",
        appearance: "none",
        outline: "none",
        border: "0",
        padding: "0",
        textAlign: "center",
        fontSize: "$2xl",
        fontFamily: "$rubik",
        lineHeight: "1.4",
        position: "absolute",
        top: 0,
        left: 0,
      },
      ".textarea-mirror": {
        display: "block",
        width: "100%",
        height: "auto",
        whiteSpace: "pre-line",
        padding: "0",
        textAlign: "center",
        fontSize: "$2xl",
        fontFamily: "$rubik",
        lineHeight: "1.4",
        color: "rgba(255,255,255,.2)",
      },
    },
  },

  ".select-scout": {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "$xs",

    ".sep": {
      display: "block",
      border: 0,
      borderLeft: "1px solid $accent",
      height: "1em",
      margin: "0 4px",
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

const ScoutButton = styled("button", {
  appearance: "none",
  outline: "none",
  border: "1px solid $brand",
  padding: "$2xs",
  background: "$background",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  boxSizing: "border-box",
  width: "100px",
  gap: "$2xs",
  fontWeight: "$normal",

  "> div": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    width: "20px",
    img: {
      display: "block",
      width: "100%",
    },
  },

  "&:hover": {
    cursor: "pointer",
    background: "$brand",
  },

  "&.active": {
    background: "$brand",
  },

  "&[disabled]": {
    cursor: "wait",
  },
});
