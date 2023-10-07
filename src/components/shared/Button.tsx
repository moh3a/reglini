import {
  BG_TRANSPARENT_BACKDROP,
  BUTTON_VARIANTS,
  PADDING,
  ROUNDED,
  SHADOW,
} from "~/config/design";
import { type ReactNode, useState } from "react";

interface ButtonProps {
  variant?: "solid" | "outline";
  type?: "button" | "submit" | "reset" | undefined;
  tabIndex?: number;
  border?: string;
  color?: string;
  children?: ReactNode;
  icon?: ReactNode;
  tooltip?: ReactNode;
  height?: string;
  onClick?: () => void;
  radius?: string;
  width?: string;
  className?: string;
  withShadow?: boolean;
  disabled?: boolean;
}

export const Button = ({
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
  tooltip,
}: ButtonProps) => {
  const [isShown, setIsShown] = useState(false);

  return (
    <div className="relative inline">
      {tooltip && isShown && (
        <div
          className={`absolute bottom-10 z-100 max-w-lg ${BG_TRANSPARENT_BACKDROP} ${PADDING} ${ROUNDED} `}
        >
          {tooltip}
        </div>
      )}
      <button
        type={type}
        className={
          (variant === "solid"
            ? BUTTON_VARIANTS.solid
            : variant === "outline"
            ? BUTTON_VARIANTS.outline
            : className) +
          (withShadow ? " " + SHADOW : "") +
          (className ? className : ` ${PADDING} ${ROUNDED} `) +
          " disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300"
        }
        onMouseEnter={() => tooltip && setIsShown(true)}
        onMouseLeave={() => tooltip && setIsShown(false)}
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
    </div>
  );
};
