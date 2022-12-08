import React from "react";
import { BUTTON_VARIANTS, PADDING, ROUNDED, SHADOW } from "@config/design";

interface ButtonProps {
  variant?: "solid" | "outline";
  type?: "button" | "submit" | "reset" | undefined;
  tabIndex?: number;
  border?: string;
  color?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  height?: string;
  onClick?: () => void;
  radius?: string;
  width?: string;
  className?: string;
  withShadow?: boolean;
  disabled?: boolean;
}

const Button = ({
  variant,
  color,
  width,
  height,
  border,
  radius,
  className,
  children,
  icon,
  tabIndex,
  type,
  onClick,
  disabled,
  withShadow,
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={
        (variant === "solid"
          ? BUTTON_VARIANTS.solid
          : variant === "outline"
          ? BUTTON_VARIANTS.outline
          : className) +
        (withShadow ? " " + SHADOW : "") +
        (className ? className : ` ${PADDING} ${ROUNDED} `)
      }
      onClick={onClick}
      tabIndex={tabIndex}
      disabled={disabled}
      style={{
        backgroundColor: color,
        border,
        borderRadius: radius,
        height,
        width,
      }}
    >
      {icon}
      <span className={icon ? "text-grim dark:text-white" : ""}>
        {children}
      </span>
    </button>
  );
};

export default Button;
