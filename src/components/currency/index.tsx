import { PADDING } from "@config/design";
import { Tab } from "@headlessui/react";

import ConvertCurrency from "./ConvertCurrency";
import HistoricalRates from "./HistoricalRates";
import LiveRate from "./LiveRate";

const TABS = [
  { name: "Live Rate", component: <LiveRate /> },
  { name: "Convert", component: <ConvertCurrency /> },
  { name: "Historical", component: <HistoricalRates /> },
];

const Currency = () => {
  return (
    <Tab.Group as={"div"}>
      <Tab.List className="flex justify-center font-bold p-1 space-x-1 rounded-xl">
        {TABS.map((tab) => (
          <Tab
            key={tab.name}
            className={({ selected }) =>
              ` hover:underline hover:decoration-aliexpress ${PADDING} ${
                selected &&
                "underline underline-offset-2 decoration-double decoration-aliexpress"
              } `
            }
          >
            {tab.name}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels>
        {TABS.map((tab) => (
          <div key={tab.name}>
            <Tab.Panel>{tab.component}</Tab.Panel>
          </div>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
};

export default Currency;
