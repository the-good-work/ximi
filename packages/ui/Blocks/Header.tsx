import { format } from "date-fns";
import React from "react";
import Text from "../Texts/Text";
import { styled } from "../theme/theme";
import Logo from "./Logo";

const StyledHeader = styled("div", {
  width: "100vw",
  position: "sticky",
  top: 0,
  textTransform: "uppercase",
  borderBottom: `1px solid $brand`,
  fontWeight: "$semibold",
  backgroundColor: "$background",
  color: "$text",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "$md $2xl",
  boxSizing: "border-box",

  ".status-group": {
    display: "flex",
    alignItems: "center",
    gap: "$lg",
  },

  ".status-box": {
    display: "flex",
    alignItems: "center",
    gap: "$sm",
  },
});

const currentDate = new Date();

export default function Header({
  room,
  version,
}: {
  room: string;
  version: string;
}) {
  return (
    <StyledHeader>
      <div className="status-box">
        <Text color="accent">Room</Text> <Text>{room}</Text>
      </div>
      <div className="logo-box">
        <Logo />
      </div>
      <div className="status-group">
        <div className="status-box">
          <Text color="accent">V</Text> <Text>{version}</Text>
        </div>
        <div className="status-box">
          <Text color="accent">D</Text>{" "}
          <Text>{format(currentDate, "eee dd MMM")}</Text>
        </div>
        <div className="status-box">
          <Text color="accent">T</Text>{" "}
          <Text>{format(currentDate, "hh:mm:ssaaa")}</Text>
        </div>
      </div>
    </StyledHeader>
  );
}
