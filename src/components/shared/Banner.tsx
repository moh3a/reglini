import { PADDING, ROUNDED } from "@config/design";
import {
  CheckBadgeIcon,
  ExclamationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { ReactNode } from "react";

interface BannerProps {
  type?: "success" | "warning" | "error";
  message?: ReactNode | string;
}

const Banner = ({ type, message }: BannerProps) => {
  return (
    <div
      className={`${ROUNDED} ${PADDING} shadow-md w-full z-40 my-3 text-sm text-left text-white font-mono font-bold ${
        type === "success"
          ? "bg-success shadow-success/50"
          : type === "warning"
          ? "bg-warning shadow-warning/50"
          : type === "error"
          ? "bg-danger shadow-danger/50"
          : "bg-grim shadow-black/50"
      } h-12 flex items-center`}
      role="alert"
    >
      {type === "success" && (
        <CheckBadgeIcon className="h-6 w-6 inline mr-2" aria-hidden="true" />
      )}
      {type === "warning" && (
        <ExclamationCircleIcon
          className="h-6 w-6 inline mr-2"
          aria-hidden="true"
        />
      )}
      {type === "error" && (
        <XCircleIcon className="h-6 w-6 inline mr-2" aria-hidden="true" />
      )}

      {message}
    </div>
  );
};

export default Banner;
