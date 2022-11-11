import { Participant } from "livekit-client";
import React, { MouseEventHandler, useState } from "react";
import {
  HourglassOutline,
  LinkOutline,
  MicOffSharp,
  MicSharp,
  PersonCircle,
  SwapHorizontal,
  VideocamOffSharp,
  VideocamSharp,
  VolumeHighSharp,
  VolumeMuteSharp,
} from "react-ionicons";
import Button from "ui/Buttons/Button";
import Input from "ui/Form/Input";
import Text from "ui/Texts/Text";
import { styled } from "ui/theme/theme";

const StyledDiv = styled("div", {
  variants: {
    type: {
      control: { border: "3px solid $accent" },
      performer: {
        border: "1px solid $brand",
      },
    },
  },
  display: "flex",
  height: "100%",
  width: "100%",
  minHeight: "240px",
  maxHeight: "370px",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",
  boxSizing: "border-box",
  padding: "$sm",
  borderRadius: "$xs",

  backgroundColor: "$background",
  color: "$text",
  gap: "$sm",

  "> div": {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "stretch",
    alignItems: "center",
    gap: "$sm",
  },

  ".footer": {
    width: "100%",
    position: "relative",
    borderTop: "1px solid $text",
    boxSizing: "border-box",
    padding: "$xs 0",
    paddingBottom: "0",
    display: "grid",
    gridTemplateColumns: "1fr 1px 1fr",
    gridGap: "$sm",

    ".footer-box": {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "start",
      alignItems: "start",
      boxSizing: "borderBox",
    },

    ".spacer": {
      width: "100%",
      height: "100%",
      borderRight: "1px solid $text",
    },

    ".stream-link": {
      ".header": {
        justifyContent: "start",
        lineHeight: 0,
        gap: "$xs",
        borderBottom: "none",
        paddingBottom: "$xs",
      },
      ".buttons": {
        display: "flex",
        gap: "$xs",
        width: "100%",
        height: "100%",

        "input.hidden": {
          position: "absolute",
          top: "-100000px",
        },
      },
    },
    ".audio-delay": {
      ".header": {
        justifyContent: "start",
        lineHeight: 0,
        gap: "$xs",
        paddingBottom: "$xs",
        borderBottom: "none",
        "path:last-child": {
          fill: "$text",
        },
      },
      ".inputs": {
        display: "flex",
        flexDirection: "row",
        gap: "$xs",
        height: "100%",

        ".delay-display": {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 $sm",
          minWidth: "50px",
          background: "$text",
          color: "$background",
          fontWeight: "$bold",
        },

        ".input-group": {
          display: "flex",
          gap: 0,
          flexDirection: "row",
        },
      },
    },
  },
  ".body": {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
    width: "100%",
    gap: "$sm",
    flexWrap: "wrap",
  },
  ".header": {
    boxSizing: "border-box",
    paddingBottom: "$sm",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid $text",

    "> div": {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "$sm",
    },

    ".identity": {
      display: "flex",
      flexDirection: "row",
      justifyContent: "start",
      alignItems: "center",
      gap: "$xs",
      path: { fill: "$text" },
      span: {
        lineHeight: 0,
      },
    },
    ".latency": {
      display: "flex",
      flexDirection: "row",
      justifyContent: "start",
      alignItems: "center",
      gap: "$xs",
      span: {
        lineHeight: 0,
        color: "$accent",
      },
    },
    ".icons": {
      display: "flex",
      flexDirection: "row",
      justifyContent: "start",
      alignItems: "center",
      gap: "$sm",
      span: {
        lineHeight: 0,
      },
      path: {
        stroke: "$text",
        fill: "$text",
      },
    },
  },
});

const StyledSubcard = styled("button", {
  appearance: "none",
  outline: "none",
  background: "$background",
  border: "1px solid $accent",
  borderRadius: "$xs",
  padding: "$xs $sm",
  display: "flex",
  flexDirection: "row",
  gap: "$xs",
  alignItems: "center",
  justifyContent: "start",
  span: {
    lineHeight: 0,
  },
  "&:hover": {
    background: "$brand",
    cursor: "pointer",
  },
  variants: {
    active: {
      true: {
        path: {
          stroke: "$accent",
          fill: "$accent",
        },
      },
      false: {
        path: {
          stroke: "$text",
          fill: "$text",
        },
      },
    },
  },
});

async function applyAudioSetting(
  type: string,
  room_name: string,
  participant: string,
  target: string
) {
  const response = await fetch(
    `${process.env.REACT_APP_SERVER_HOST}/rooms/apply-setting`,
    {
      method: "PATCH",
      body: JSON.stringify({
        type,
        room_name,
        participant,
        target,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response;
}

function ParticipantSubcard({
  participant,
  onClick,
}: {
  participant: Participant;
  onClick?: MouseEventHandler;
}) {
  return (
    <StyledSubcard active={false} onClick={onClick}>
      {/* {participant.audioTracks.size > 0 ? (
        <VolumeHighSharp color="inherit" width="14px" />
      ) : (
        <VolumeMuteSharp color="inherit" width="14px" />
      )} */}
      <Text size="2xs">{participant.identity}</Text>
    </StyledSubcard>
  );
}

export default function AudioMixCard({
  participant,
  roomName,
  participants,
  type = "performer",
}: {
  participant: Participant | any;
  participants: Participant[];
  roomName: string;
  type?: "performer" | "control";
}) {
  const [delay, setDelay] = useState<number>(0);
  // const part = useParticipant(participant);
  // console.log(part);

  return (
    <StyledDiv type={type}>
      <div>
        <div className="header">
          <div>
            <div className="identity">
              <PersonCircle color="inherit" width="20px" height="20px" />
              <Text size="xs">{participant.identity}</Text>
            </div>
            <div className="latency">
              <SwapHorizontal color="inherit" width="20px" height="20px" />
              <Text size="xs">
                {participant?.signalClient?.pingInterval || 0}
              </Text>
            </div>
          </div>
          {/* <div className="icons">
            {participant.audioTracks.size > 0 ? (
              <MicSharp width="20px" />
            ) : (
              <MicOffSharp width="20px" />
            )}
            {participant.videoTracks.size > 0 ? (
              <VideocamSharp width="20px" />
            ) : (
              <VideocamOffSharp width="20px" />
            )}
          </div> */}
        </div>
        <div className="body">
          {participants
            .filter((p: any) => p.type === "PERFORMER")
            .map((p) => {
              return (
                <ParticipantSubcard
                  onClick={() => {
                    //if state of target for this participant is unmuted
                    applyAudioSetting(
                      "MUTE_AUDIO",
                      roomName,
                      participant.identity,
                      p.identity
                    )
                      .then((e) => {
                        // console.log(participant);
                      })
                      .catch((err) => {
                        console.log(err);
                      });

                    //else if state of target for this participant is muted
                    // applyAudioSetting("UNMUTE_AUDIO", roomName, participant.identity, p.identity)
                    // .then((e) => {
                    //   // console.log(participant);
                    // })
                    // .catch((err) => {
                    //   console.log(err);
                    // });
                  }}
                  key={p.identity}
                  participant={p}
                />
              );
            })}
        </div>
      </div>
      {participant.type === "PERFORMER" && (
        <div className="footer">
          <div className="footer-box stream-link">
            <div className="header">
              <LinkOutline color="inherit" width="14px" />
              <Text size="2xs">Copy Stream Link</Text>
            </div>
            <div className="buttons">
              <Button
                onClick={() => {
                  let input = document.querySelector(
                    `#${`stream_url_${participant.sid}`}`
                  );
                  // input?.select();
                  // document.execCommand("copy");
                }}
                size="sm"
                variant="outline"
                css={{
                  path: {
                    fill: "$text",
                  },
                  span: {
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                }}
              >
                <VideocamSharp color="inherit" width="20px" />
              </Button>
              <Button
                onClick={() => {
                  console.log("Copy video and audio link");
                }}
                size="sm"
                variant="outline"
                css={{
                  span: {
                    display: "flex",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: 0,
                    path: {
                      fill: "$text",
                    },
                    "path:not(:last-child)": {
                      fill: "none",
                    },
                  },
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <VideocamSharp color="inherit" width="20px" /> +{" "}
                <VolumeHighSharp color="inherit" width="20px" />
              </Button>
              <input
                type="text"
                className="hidden"
                id={`stream_url_${participant.sid}`}
                // value={`${process.env.REACT_APP_VIEWER_BASE_URL}?room=${context.room.name}&passcode=${context.passcode}&target=${nickname}`}
                readOnly
              />

              <input
                type="text"
                className="hidden"
                id={`stream_url_a_${participant.sid}`}
                // value={`${process.env.REACT_APP_VIEWER_BASE_URL}?room=${context.room.name}&passcode=${context.passcode}&target=${nickname}&audio=1`}
                readOnly
              />
            </div>
          </div>
          <div className="spacer" />
          <div className="footer-box audio-delay">
            <div className="header">
              <HourglassOutline color="inherit" width="14px" />
              <Text size="2xs">Output Audio Delay</Text>
            </div>
            <div className="inputs">
              <div className="delay-display">{delay}</div>
              <div className="input-group">
                <Input
                  id={`desired_delay_${participant.sid}`}
                  type="text"
                  css={{
                    fontSize: "$sm",
                    border: "1px solid $text",
                    backgroundColor: "$grey",
                    color: "$text",
                    borderRadius: 0,
                    "&:hover": {
                      color: "$background",
                      backgroundColor: "$text",
                    },
                  }}
                  maxLength="4"
                />
                <Button
                  size="sm"
                  css={{
                    maxWidth: "60px",
                    padding: "0",
                    alignItems: "center",
                    justifyContent: "center",
                    textTransform: "uppercase",
                    border: "1px solid $text",
                    borderRadius: 0,
                  }}
                  onClick={() => {
                    let delayInput: any = document.getElementById(
                      `desired_delay_${participant.sid}`
                    );
                    let _delay: number = parseInt(delayInput.value);
                    if (isNaN(_delay)) {
                      setDelay(0);
                    } else setDelay(_delay);

                    delayInput.value = null;
                  }}
                >
                  Set
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </StyledDiv>
  );
}
