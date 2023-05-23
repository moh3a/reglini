import Title from "@components/shared/Title";
import { useTranslations } from "next-intl";

const HistoricalRates = () => {
  const t = useTranslations("CurrencyPage.historical");
  return <Title center={true} title={t("comingSoon")} />;
};

export default HistoricalRates;
