import {
  AtSymbolIcon,
  CurrencyEuroIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/solid";

export const PAGES = [
  {
    name: "Aliexpress",
    url: "/aliexpress",
    logo: { type: "svg", path: "/AliexpressIcon.svg" },
  },
  {
    name: "Currency Exchange",
    url: "/currency",
    logo: {
      type: "heroicons",
      component: (
        <CurrencyEuroIcon className="h-5 w-5 inline mr-1" aria-hidden="true" />
      ),
    },
  },
  {
    name: "Support",
    url: "/support",
    logo: {
      type: "heroicons",
      component: (
        <AtSymbolIcon className="h-5 w-5 inline mr-1" aria-hidden="true" />
      ),
    },
  },
  {
    name: "FAQ",
    url: "/faq",
    logo: {
      type: "heroicons",
      component: (
        <QuestionMarkCircleIcon
          className="h-5 w-5 inline mr-1"
          aria-hidden="true"
        />
      ),
    },
  },
];
