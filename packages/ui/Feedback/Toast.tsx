import React, { useEffect, useRef } from "react";
import {
  Root,
  ToastClose,
  ToastDescription,
  ToastTitle,
  ToastViewport,
} from "@radix-ui/react-toast";
import { styled } from "../theme/theme";
import { keyframes } from "@stitches/react";
import { ToastType } from "../../../types/component";

const StyledToast = styled(Root, {});

const VIEWPORT_PADDING = 25;

const hide = keyframes({
  "0%": { opacity: 1 },
  "100%": { opacity: 0 },
});

const slideIn = keyframes({
  from: { transform: `translateX(calc(100% + ${VIEWPORT_PADDING}px))` },
  to: { transform: "translateX(0)" },
});

const swipeOut = keyframes({
  from: { transform: "translateX(var(--radix-toast-swipe-end-x))" },
  to: { transform: `translateX(calc(100% + ${VIEWPORT_PADDING}px))` },
});

export default function Toast({
  title,
  description,
  toast,
  setToast,
}: {
  title: string;
  description: string;
  toast: ToastType;
  setToast: any;
}) {
  const timerRef = useRef(0);

  const toastTimer = toast?.duration || 5000;

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    if (toast != null) {
      handleToast();
    } else return;
  }, [toast]);

  function handleToast() {
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setToast(null);
    }, toastTimer);
  }

  const openToast = toast != null;

  return (
    <>
      <StyledToast open={openToast}>
        <ToastTitle>{title}</ToastTitle>
        {toast?.description && (
          <ToastDescription>{description}</ToastDescription>
        )}
        {toast?.isCloseable && <ToastClose />}
      </StyledToast>

      <ToastViewport />
    </>
  );
}
