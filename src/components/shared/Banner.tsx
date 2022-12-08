import {
  CheckBadgeIcon,
  ExclamationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

interface BannerProps {
  type?: "success" | "warning" | "error";
  message?: string;
}

const Banner = ({ type, message }: BannerProps) => {
  return (
    <div
      className={`w-full z-40 my-3 text-sm text-left text-white ${
        type === "success"
          ? "bg-success"
          : type === "warning"
          ? "bg-warning"
          : type === "error"
          ? "bg-danger"
          : "bg-grim"
      } h-12 flex items-center p-5`}
      role="alert"
    >
      {type === "warning" && (
        <CheckBadgeIcon className="h-6 w-6 inline mr-2" aria-hidden="true" />
      )}
      {type === "success" && (
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
