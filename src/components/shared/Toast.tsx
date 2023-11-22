import { ROUNDED } from "~/config/design";
import {
  CheckBadgeIcon,
  ExclamationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import type { ReactNode,  } from "react";
import { Button } from "./Button";

interface Message {
  type?: "success" | "warning" | "error";
  children: ReactNode;
  onClose: () => void
}

export const Toast = ({ children, type, onClose  }: Message) => {
  return (
        <div
          className={`fixed bottom-10 z-100 m-5 max-w-2xl bg-opacity-50 font-bold backdrop-blur-md ${ROUNDED} ${
            type === "success"
              ? "bg-success shadow-sm shadow-success/50"
              : type === "warning"
              ? "bg-warning shadow-sm shadow-warning/50"
              : type === "error"
              ? "bg-danger shadow-sm shadow-danger/50"
              : ""
          } `}
          role="alert"
        >
          <div className="flex justify-between">
            <div className="flex w-full flex-grow items-center p-1">
              {type === "success" && (
                <CheckBadgeIcon className="mr-2 h-6 w-6" aria-hidden="true" />
              )}
              {type === "warning" && (
                <ExclamationCircleIcon
                  className="mr-2 h-6 w-6"
                  aria-hidden="true"
                />
              )}
              {type === "error" && (
                <XCircleIcon className="mr-2 h-6 w-6" aria-hidden="true" />
              )}
              <div className="flex w-full items-center">{children}</div>
            </div>
            <div className="flex basis-[5%] items-center justify-center p-1">
              <Button variant="outline" onClick={onClose}>
                <span className="sr-only">Close</span>
                <XMarkIcon className="inline h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
  );
};
