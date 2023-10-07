import type { ReactNode } from "react";
import {
  CheckBadgeIcon,
  ExclamationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

import { PADDING, ROUNDED } from "~/config/design";

interface BannerProps {
  type?: "success" | "warning" | "error";
  message?: ReactNode | string;
}

export const Banner = ({ type, message }: BannerProps) => {
  return (
    <div
      className={`${ROUNDED} ${PADDING} z-40 my-3 w-full overflow-hidden font-mono text-sm font-bold text-white shadow-md ${
        type === "success"
          ? "bg-success shadow-success/50"
          : type === "warning"
          ? "bg-warning shadow-warning/50"
          : type === "error"
          ? "bg-danger shadow-danger/50"
          : "bg-grim shadow-black/50"
      } flex h-12 items-center`}
      role="alert"
    >
      {type === "success" && (
        <CheckBadgeIcon className="mr-2 inline h-6 w-6" aria-hidden="true" />
      )}
      {type === "warning" && (
        <ExclamationCircleIcon
          className="mr-2 inline h-6 w-6"
          aria-hidden="true"
        />
      )}
      {type === "error" && (
        <XCircleIcon className="mr-2 inline h-6 w-6" aria-hidden="true" />
      )}

      {message}
    </div>
  );
};
