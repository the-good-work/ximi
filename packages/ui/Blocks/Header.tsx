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
    <StyledHeader
      css={{ "@base": { fontSize: "$2xs" }, "@md": { fontSize: "$xs" } }}
    >
      <div className="status-box" aria-label="Current room">
        <Text color="accent" aria-hidden="true">
          Room
        </Text>
        <Text>{room}</Text>
      </div>

      <Logo position="center" />

      <div className="status-group">
        <div className="status-box" aria-label="Version">
          <Text color="accent" aria-hidden="true">
            V
          </Text>
          <Text>{version}</Text>
        </div>
        <div className="status-box" aria-label="Date">
          <Text color="accent" aria-hidden="true">
            D
          </Text>
          <Text>{format(currentDate, "eee dd MMM")}</Text>
        </div>
        <div className="status-box" aria-label="Time">
          <Text color="accent" aria-hidden="true">
            T
          </Text>
          <Text>{format(currentDate, "hh:mm:ssaaa")}</Text>
        </div>
      </div>
    </StyledHeader>
  );
}
