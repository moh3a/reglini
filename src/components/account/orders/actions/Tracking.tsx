import { Dispatch, SetStateAction } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

import { trpc } from "~/utils/trpc";
import { TEXT_GRADIENT } from "~/config/design";
import { Loading, Button } from "~/components/shared";
import type { IMessage } from "~/types/index";

interface TrackingProps {
  order_id: string;
  tracking_id: string;
  service_name: string;
  setMessage: Dispatch<SetStateAction<IMessage | undefined>>;
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

  const t = useTranslations("AccountPage.orders.track");

  return (
    <div>
      <h2 className="font-mono text-xl">
        {t("trackingId")}: <span className={TEXT_GRADIENT}>{tracking_id}</span>
      </h2>
      <h3 className="mb-4">{t("shippedBy", { service: service_name })}</h3>
      {trackingQuery.isLoading && (
        <div className="w-full flex justify-center items-center">
          <Loading size="medium" />
        </div>
      )}
      {trackingQuery.data &&
        trackingQuery.data.result &&
        trackingQuery.data.result.details.map((event) => (
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
          {t("close")}
        </Button>
      </div>
    </div>
  );
};

export default Tracking;
