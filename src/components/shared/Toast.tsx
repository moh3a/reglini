import { ROUNDED, SHADOW } from "~/config/design";
import { XMarkIcon } from "@heroicons/react/24/outline";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { Button } from "./Button";

interface Message {
  type?: "success" | "warning" | "error";
  children: ReactNode;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const Toast = ({ children, type, isOpen, setIsOpen }: Message) => {
  return (
    <>
      {isOpen && (
        <div
          className={`fixed bottom-10 z-100 m-5 bg-opacity-50 font-bold backdrop-blur-md ${ROUNDED} ${SHADOW} ${
            type === "success"
              ? "bg-success"
              : type === "warning"
              ? "bg-warning"
              : type === "error"
              ? "bg-danger"
              : ""
          } `}
          role="alert"
        >
          <div className="flex">
            <div>{children}</div>
            <div className="ml-auto basis-1/12 p-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                <span className="sr-only">Close</span>
                <XMarkIcon className="inline h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
