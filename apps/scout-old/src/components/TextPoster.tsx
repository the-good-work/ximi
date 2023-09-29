import { styled } from "@stitches/react";

const StyledTextPoster = styled("div", {
  position: "fixed",
  width: "100%",
  height: "100%,",
  color: "$text",
  fontSize: "10vh",
  whiteSpace: "pre-line",
});

export default function TextPoster({
  text,
  visible,
}: {
  text: string;
  visible: boolean;
}) {
  return (
    <StyledTextPoster style={{ opacity: visible ? 1 : 0 }}>
      {text}
    </StyledTextPoster>
  );
}
