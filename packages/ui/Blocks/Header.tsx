import { format } from "date-fns";
import React, { useEffect, useState } from "react";
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
      gap: "$xs",
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
        <Text color="accent" aria-hidden="true" size="xs">
          Room
        </Text>
        <Text size="xs">{room}</Text>
      </div>

      <Logo position="center" size="xs" />

      <div className="status-group">
        <div className="status-box" aria-label="Version">
          <Text color="accent" aria-hidden="true" size="xs">
            V
          </Text>
          <Text size="xs">{version}</Text>
        </div>
        <div className="status-box" aria-label="Date">
          <Text size="xs" color="accent" aria-hidden="true">
            D
          </Text>
          <Text size="xs">{format(currentDate, "eee dd MMM")}</Text>
        </div>
        <div className="status-box" aria-label="Time">
          <Text size="xs" color="accent" aria-hidden="true">
            T
          </Text>
          <Text size="xs">{format(currentDate, "hh:mm:ssaaa")}</Text>
        </div>
      </div>
    </StyledHeader>
  );
}
