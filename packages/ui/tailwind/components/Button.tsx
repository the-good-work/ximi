import classNames from "classnames";

type Size = "2xs" | "xs" | "sm" | "lg" | "xl" | "2xl" | "3xl" | "base";

export const Button: React.FC<{
  size?: Size;
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: "default" | "primary";
}> = ({
  size = "md",
  children,
  onClick,
  variant = "default",
  disabled = false,
}) => {
  const className = classNames(
    `text-${String(size)} w-full border py-1 px-2 rounded-md`,
    {
      "bg-bg border-text text-text": variant === "default",
      "bg-brand border-text text-text": variant === "primary",
      "opacity-50 cursor-default pointer-events-none": disabled === true,
    },
    "[&:hover]:bg-brand/50",
  );

  return (
    <button
      onClick={onClick}
      className={className}
      type="button"
      aria-disabled={disabled}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
