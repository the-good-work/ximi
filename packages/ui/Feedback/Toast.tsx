import React, { createContext, useContext, useState } from "react";
import * as RadixToast from "@radix-ui/react-toast";

import { styled } from "../theme/theme";
import { VariantProps, keyframes } from "@stitches/react";
import { CloseCircleOutline } from "react-ionicons";

const Ctx = createContext<{
  toasts: XMToast[];
  toast: (toast: XMToast) => void;
}>({
  toasts: [],
  toast: () => {},
});
Ctx.displayName = "XimiToastContext";

/* START STYLING */

const animToastIn = keyframes({
  "0%": {
    opacity: 0,
    transform: "translate(0, 100%)",
  },
  "100%": {
    opacity: 1,
    transform: "translate(0, 0)",
  },
});

const animToastOut = keyframes({
  "0%": {
    opacity: 1,
    transform: "translate(0, 0)",
  },
  "100%": {
    opacity: 0,
    transform: "translate(0, 100%)",
  },
});

const Root = styled(RadixToast.Root, {
  background: "linear-gradient($brandGradientC), $background",
  color: "$text",
  position: "relative",
  padding: "$sm $xl $sm $sm",
  listStyle: "none",
  margin: "$sm 0",
  borderRadius: "$xs",
  fontSize: "$md",
  width: "100%",
  boxSizing: "border-box",

  "&[data-state=open]": {
    animation: `${animToastIn} .5s ease-in`,
  },
  "&[data-state=closed]": {
    animation: `${animToastOut} .5s ease-out`,
  },

  variants: {
    tone: { warning: { background: "purple" } },
    jumbo: { true: { fontSize: "$lg" }, false: { fontSize: "$md" } },
  },
});

const Title = styled(RadixToast.Title, {
  variants: {
    jumbo: { true: { fontSize: "$lg" }, false: { fontSize: "$md" } },
  },
});

const Close = styled(RadixToast.Close, {
  display: "block",
  position: "absolute",
  right: "12px",
  top: "50%",
  transform: "translate(0, -50%)",
  appearance: "none",
  border: 0,
  color: "$text",
  background: "transparent",
  cursor: "pointer",

  svg: {
    display: "block",
  },
});

const Viewport = styled(RadixToast.Viewport, {
  margin: "0",
  padding: "0",
  width: "80%",
  boxSizing: "border-box",
  position: "fixed",
  bottom: "20px",
  transform: "translate(-50%, 0)",
});

const Description = styled(RadixToast.Description, {
  variants: {
    jumbo: { true: { fontSize: "$md" }, false: { fontSize: "$sm" } },
  },
});

/* END STYLING */

const XimiToast = ({ children }: { children: React.ReactChildren }) => {
  const [toasts, setToasts] = useState<XMToast[]>([]);
  return (
    <Ctx.Provider
      value={{
        toasts,
        toast: (t: XMToast) => {
          setToasts((toasts) => [...toasts, t]);
        },
      }}
    >
      {children}
      <RadixToast.Provider duration={5000}>
        {toasts.map((toast, n) => (
          <SingleToast {...toast} key={`toast_${n}`} />
        ))}
        <Viewport />
      </RadixToast.Provider>
    </Ctx.Provider>
  );
};

const SingleToast = ({ title, description, tone, jumbo }: XMToast) => {
  return (
    <Root tone={tone} jumbo={jumbo}>
      <Title jumbo={jumbo}>{title}</Title>
      {description && <Description jumbo={jumbo}>{description}</Description>}
      <Close>
        <CloseCircleOutline color="inherit" width={"24px"} height={"24px"} />
      </Close>
    </Root>
  );
};

const useToast = () => {
  const { toast } = useContext(Ctx);
  return { toast };
};

export { XimiToast, useToast };

export type XMToast = {
  title: string;
  description?: string;
  tone?: VariantProps<typeof Root>["tone"];
  jumbo?: boolean;
};
