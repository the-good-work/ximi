import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import Text from "../Texts/Text";
import Icon from "../Texts/Icon";
import { styled } from "../theme/theme";
import Logo from "./Logo";
import {
  CalendarClearOutline,
  TimeOutline,
  LayersOutline,
} from "react-ionicons";

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
  boxSizing: "border-box",

  ".status-group": {
    display: "flex",
    alignItems: "center",
  },

  ".status-box": {
    display: "flex",
    alignItems: "center",
  },

  "@base": {
    padding: "$xs $md",
    ".status-box": {
      gap: "$2xs",
    },
    ".status-group": {
      gap: "$xs",
    },
  },

  "@md": {
    padding: "$sm $md",
    ".status-box": {
      gap: "$xs",
    },
    ".status-group": {
      gap: "$md",
    },
  },
});

export default function Header({
  room,
  version,
}: {
  room: string;
  version: string;
}) {
  let [currentDate, setCurrentDate] = useState(new Date());
  useEffect(() => {
    setTimeout(() => {
      setCurrentDate(new Date());
    }, 1000);
  }, [currentDate]);
  return (
    <StyledHeader>
      <div className="status-box" aria-label="Current room">
        <Text color="accent" aria-hidden="true" size="2xs">
          Room
        </Text>
        <Text size="2xs">{room}</Text>
      </div>

      <Logo position="center" size="xs" />

      <div className="status-group">
        <div className="status-box" aria-label="Version">
          <Icon
            css={{ marginBottom: "1px" }}
            size="sm"
            color="accent"
            icon={<LayersOutline color="inherit" />}
          />
          <Text size="2xs">{process.env.REACT_APP_VERSION}</Text>
        </div>
        <div className="status-box" aria-label="Date">
          <Text size="2xs" color="accent" aria-hidden="true">
            <Icon
              css={{ marginBottom: "1px" }}
              size="sm"
              color="accent"
              icon={<CalendarClearOutline color="inherit" />}
            />
          </Text>
          <Text size="2xs">{format(currentDate, "eee dd MMM")}</Text>
        </div>
        <div className="status-box" aria-label="Time">
          <Icon
            size="sm"
            css={{ marginBottom: "1px" }}
            color="accent"
            icon={<TimeOutline color="inherit" />}
          />
          <Text size="2xs">{format(currentDate, "hh:mm:ssaaa")}</Text>
        </div>
      </div>
    </StyledHeader>
  );
}
