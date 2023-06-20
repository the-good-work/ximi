import { styled } from "@stitches/react";

const StyledTextPoster = styled("div", {
  position: "fixed",
  width: "100%",
  height: "100%,",
  color: "$text",
  fontSize: "10vh",
});

export default function TextPoster({ text }: { text: string }) {
  return <StyledTextPoster>{text}</StyledTextPoster>;
}
