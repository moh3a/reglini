import { Title } from "@components/shared";
import { useTranslations } from "next-intl";

const HistoricalRates = () => {
  const t = useTranslations("CurrencyPage.historical");
  return <Title center={true} title={t("comingSoon")} />;
};

export default HistoricalRates;
