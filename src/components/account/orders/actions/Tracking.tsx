import type { Dispatch, SetStateAction } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

import { api } from "~/utils/api";
import { TEXT_GRADIENT } from "~/config/design";
import { Loading, Button } from "~/components/shared";
import { useMessage } from "~/utils/store";
import { ONE_DAY_IN_SECONDS } from "~/utils";

interface TrackingProps {
  order_id: string;
  tracking_id: string;
  service_name: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const Tracking = ({
  order_id,
  service_name,
  tracking_id,
  setIsOpen,
}: TrackingProps) => {
  const { setTimedMessage } = useMessage();
  const trackingQuery = api.aliexpress.ds.tracking.useQuery(
    {
      order_id,
      tracking_id,
      service_name,
    },
    {
      cacheTime: ONE_DAY_IN_SECONDS,
      keepPreviousData: true,
      onSettled(data, error) {
        if (error)
          setTimedMessage({
            type: "error",
            text: error.message ?? "",
            duration: 3000,
          });
        if (data) {
          if (!data.success)
            setTimedMessage({
              type: "error",
              text: data.error ?? "",
              duration: 3000,
            });
        }
      },
    },
  );

  const t = useTranslations("AccountPage.orders.track");

  return (
    <div>
      <h2 className="font-mono text-xl">
        {t("trackingId")}: <span className={TEXT_GRADIENT}>{tracking_id}</span>
      </h2>
      <h3 className="mb-4">{t("shippedBy", { service: service_name })}</h3>
      {trackingQuery.isLoading && (
        <div className="flex w-full items-center justify-center">
          <Loading size="medium" />
        </div>
      )}
      {trackingQuery.data?.result?.details?.map((event) => (
        <p key={event.event_date} className="font-semibold">
          {event.event_date}
          {" - "}
          {event.event_desc}
        </p>
      ))}
      <div className="my-4 flex justify-end">
        <Button
          variant="outline"
          icon={
            <XMarkIcon className="mr-2 inline h-5 w-5" aria-hidden="true" />
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
