import { ROUNDED, SHADOW } from "@config/design";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Dispatch, ReactNode, SetStateAction } from "react";
import Button from "./Button";

interface Message {
  type?: "success" | "warning" | "error";
  children: ReactNode;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const Toast = ({ children, type, isOpen, setIsOpen }: Message) => {
  return (
    <>
      {isOpen && (
        <div
          className={`absolute bottom-10 z-100 m-5 bg-opacity-50 backdrop-blur-md font-bold ${ROUNDED} ${SHADOW} ${
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
            {children}
            <div className="basis-1/12 ml-auto p-4">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                <span className="sr-only">Close</span>
                <XMarkIcon className="h-5 w-5 inline" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Toast;
