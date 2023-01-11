import { Dispatch, SetStateAction } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

import { trpc } from "@utils/trpc";
import { TEXT_GRADIENT } from "@config/design";
import Loading from "@components/shared/Loading";
import Button from "@components/shared/Button";

interface TrackingProps {
  order_id: string;
  tracking_id: string;
  service_name: string;
  setMessage: Dispatch<
    SetStateAction<{
      type?: "error" | "success" | undefined;
      text?: string | undefined;
    }>
  >;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const Tracking = ({
  order_id,
  service_name,
  tracking_id,
  setMessage,
  setIsOpen,
}: TrackingProps) => {
  const trackingQuery = trpc.aliexpress.ds.tracking.useQuery(
    {
      order_id,
      tracking_id,
      service_name,
    },
    {
      onSettled(data, error) {
        if (error) setMessage({ type: "error", text: error.message });
        if (data) {
          if (!data.success) setMessage({ type: "error", text: data.error });
        }
        setTimeout(
          () => setMessage({ type: undefined, text: undefined }),
          3000
        );
      },
    }
  );

  return (
    <div>
      <h2 className="font-mono text-xl">
        Tracking ID: <span className={TEXT_GRADIENT}>{tracking_id}</span>
      </h2>
      <h3 className="mb-4">
        The product will be shipped from China to Algeria by {service_name}
      </h3>
      {trackingQuery.isLoading && (
        <div className="w-full flex justify-center items-center">
          <Loading size="medium" />
        </div>
      )}
      {trackingQuery.data &&
        trackingQuery.data.result &&
        trackingQuery.data.result.details.details.map((event) => (
          <p key={event.event_date} className="font-semibold">
            {event.event_date}
            {" - "}
            {event.event_desc}
          </p>
        ))}
      <div className="flex justify-end my-4">
        <Button
          variant="outline"
          icon={
            <XMarkIcon className="inline h-5 w-5 mr-2" aria-hidden="true" />
          }
          onClick={() => setIsOpen(false)}
          type="button"
        >
          cancel
        </Button>
      </div>
    </div>
  );
};

export default Tracking;
