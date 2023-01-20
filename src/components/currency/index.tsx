import { PADDING } from "@config/design";
import { Tab } from "@headlessui/react";
import { useRouter } from "next/router";

import ConvertCurrency from "./ConvertCurrency";
import HistoricalRates from "./HistoricalRates";
import LiveRate from "./LiveRate";

const TABS = [
  {
    name: { fr: "Taux actuel", ar: "الأسعار الحية", en: "Live Rate" },
    component: <LiveRate />,
  },
  {
    name: { fr: "Convertir", ar: "تحويل", en: "Convert" },
    component: <ConvertCurrency />,
  },
  {
    name: { fr: "Historique", ar: "الأسعار التاريخية", en: "Historical" },
    component: <HistoricalRates />,
  },
];

const Currency = () => {
  const router = useRouter();

  return (
    <Tab.Group as={"div"}>
      <Tab.List className="flex justify-center font-bold p-1 space-x-1 rounded-xl">
        {TABS.map((tab) => (
          <Tab
            key={tab.name.fr}
            className={({ selected }) =>
              ` hover:underline hover:decoration-aliexpress ${PADDING} ${
                selected &&
                "underline underline-offset-2 decoration-double decoration-aliexpress"
              } `
            }
          >
            {tab.name[(router.locale as "fr" | "en" | "ar") ?? "fr"]}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels>
        {TABS.map((tab) => (
          <div key={tab.name.fr}>
            <Tab.Panel>{tab.component}</Tab.Panel>
          </div>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
};

export default Currency;
