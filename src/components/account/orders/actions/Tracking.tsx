import { Dispatch, SetStateAction } from "react";
import { trpc } from "@utils/trpc";

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
}

const Tracking = ({
  order_id,
  service_name,
  tracking_id,
  setMessage,
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

  return <div>{JSON.stringify(trackingQuery)}</div>;
};

export default Tracking;
