import { styled } from "@stitches/react";
import React, { Dispatch, useState } from "react";
import ToggleIconButton from "ui/Buttons/ToggleIconButton";
import {
  Bug,
  Chatbox,
  Exit,
  Videocam,
  VolumeHigh,
  VolumeMute,
} from "react-ionicons";
import { Room } from "livekit-client";
import { UpdateStateActions } from "../../../../types/performerStates";

export default function ControlTray({
  room,
  updateState,
}: {
  room?: Room;
  updateState: Dispatch<UpdateStateActions>;
}) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <ButtonTray open={open ? "open" : "closed"}>
        <ToggleIconButton size={open ? "lg" : "md"} icon={<VolumeHigh />} />
        <ToggleIconButton size={open ? "lg" : "md"} icon={<VolumeMute />} />
        <ToggleIconButton
          active={true}
          size={open ? "lg" : "md"}
          icon={<Videocam />}
        />
        <ToggleIconButton size={open ? "lg" : "md"} icon={<Chatbox />} />
        <ToggleIconButton
          active={true}
          size={open ? "lg" : "md"}
          icon={<Bug />}
        />
        <ToggleIconButton
          size={open ? "lg" : "md"}
          icon={<Exit />}
          variant="warning"
          onClick={() => {
            const confirm = window.confirm("Are you sure you want to exit?");
            if (!confirm) {
              return;
            }
            room?.disconnect().catch((err) => {
              console.log(err);
            });
            updateState({
              type: "back-to-list",
            });
          }}
        />
      </ButtonTray>
      {open && (
        <ModalOverlay
          onClick={() => {
            setOpen(false);
          }}
        />
      )}
      <TriggerArea
        open={open ? "open" : "closed"}
        onClick={() => {
          setOpen(true);
        }}
      />
    </>
  );
}

const TriggerArea = styled("div", {
  position: "fixed",
  zIndex: 5000,
  background: "transparent",
  width: "calc(100% - 120px)",
  height: "70px",
  left: "50%",
  transform: "translate(-50%, 0)",
  variants: { open: { open: { bottom: "-200px" }, closed: { bottom: 0 } } },
});

const ButtonTray = styled("div", {
  position: "fixed",
  bottom: "$sm",
  zIndex: 4900,
  display: "flex",
  transition: "all ease .1s",

  ">button + button": {
    borderLeft: "none",
  },
  ">button:first-child()": { borderLeft: "1px solid $brand" },

  variants: {
    open: {
      open: {
        bottom: "$3xl",
      },
      closed: {
        bottom: "$sm",
      },
    },
  },
});

const ModalOverlay = styled("div", {
  position: "fixed",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0,
  zIndex: 4000,
  background: "transparent",
});
