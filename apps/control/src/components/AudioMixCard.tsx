import { Participant } from "livekit-client";
import React, { Dispatch, SetStateAction } from "react";
import {
  HourglassOutline,
  HourglassSharp,
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
import Text from "ui/Texts/Text";
import { styled } from "ui/theme/theme";

const StyledDiv = styled("div", {
  display: "flex",
  height: "100%",
  width: "100%",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",
  boxSizing: "border-box",
  padding: "$sm",
  paddingBottom: "0",
  borderRadius: "$xs",
  border: "3px solid $accent",
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
    minHeight: "80px",
    maxHeight: "80px",
    height: "80px",
    position: "relative",
    borderTop: "1px solid $text",
    boxSizing: "border-box",
    padding: "$xs 0",
    display: "grid",
    gridTemplateColumns: "1fr 1px 1fr",
    // gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gridGap: "$sm",

    ".footer-box": {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "start",
      alignItems: "start",
      boxSizing: "borderBox",
      padding: "$xs",
    },

    ".spacer": {
      width: "100%",
      height: "100%",
      borderRight: "1px solid $text",
    },

    ".stream-link": {
      paddingLeft: "0",

      ".header": {
        justifyContent: "start",
        lineHeight: 0,
        gap: "$xs",
        borderBottom: "none",
      },
      ".buttons": {
        display: "flex",
        gap: "$xs",
        width: "100%",
      },
    },
    ".audio-delay": {
      paddingRight: "0",
      ".header": {
        justifyContent: "start",
        lineHeight: 0,
        gap: "$xs",
        borderBottom: "none",
        "path:last-child": {
          fill: "$text",
        },
      },
    },
  },
  ".body": {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
    width: "100%",
    gap: "$md",
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
      gap: "$sm",
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

const StyledSubcard = styled("div", {
  border: "1px solid $accent",
  borderRadius: "$xs",
  padding: "$xs $sm",
  display: "flex",
  flexDirection: "row",
  gap: "$sm",
  alignItems: "center",
  justifyContent: "start",
  span: {
    lineHeight: 0,
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

function ParticipantSubcard({ participant }: { participant: Participant }) {
  return (
    <StyledSubcard active={participant.audioTracks.size > 0}>
      {participant.audioTracks.size > 0 ? (
        <VolumeHighSharp color="inherit" />
      ) : (
        <VolumeMuteSharp color="inherit" />
      )}
      <Text size="xs">{participant.identity}</Text>
    </StyledSubcard>
  );
}

export default function AudioMixCard({
  participant,
  participants,
}: {
  participant: Participant | any;
  participants: Participant[];
}) {
  return (
    <StyledDiv>
      <div>
        <div className="header">
          <div>
            <div className="identity">
              <PersonCircle color="inherit" width="20px" height="20px" />
              <Text>{participant.identity}</Text>
            </div>
            <div className="latency">
              <SwapHorizontal color="inherit" width="20px" height="20px" />
              <Text>{participant?.signalClient?.pingInterval || 0}</Text>
            </div>
          </div>
          <div className="icons">
            {participant.audioTracks.size > 0 ? <MicSharp /> : <MicOffSharp />}
            {participant.videoTracks.size > 0 ? (
              <VideocamSharp />
            ) : (
              <VideocamOffSharp />
            )}
          </div>
        </div>
        <div className="body">
          {participants
            .filter((p) => p.metadata === "PERFORMER")
            .map((p) => {
              return <ParticipantSubcard key={p.identity} participant={p} />;
            })}
        </div>
      </div>
      {participant.metadata === "PERFORMER" && (
        <div className="footer">
          <div className="footer-box stream-link">
            <div className="header">
              <LinkOutline color="inherit" />
              <Text size="2xs">Copy Stream Link</Text>
            </div>
            <div className="buttons">
              <Button
                variant="outline"
                css={{
                  path: {
                    fill: "$text",
                  },
                }}
              >
                <VideocamSharp color="inherit" />
              </Button>
              <Button
                variant="outline"
                css={{
                  span: {
                    path: {
                      fill: "$text",
                    },
                    "path:not(:last-child)": {
                      fill: "none",
                    },
                  },
                }}
              >
                <VideocamSharp color="inherit" /> +{" "}
                <VolumeHighSharp color="inherit" />
              </Button>
            </div>
          </div>
          <div className="spacer" />
          <div className="footer-box audio-delay">
            <div className="header">
              <HourglassOutline color="inherit" />
              <Text size="2xs">Output Audio Delay</Text>
            </div>
            <div className="inputs"></div>
          </div>
        </div>
      )}
    </StyledDiv>
  );
}
