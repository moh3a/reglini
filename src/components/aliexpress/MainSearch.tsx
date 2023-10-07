import { type FormEvent, useState } from "react";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import { AliExpressLogo, SearchInput } from "~/components/shared";

export const MainSearch = () => {
  const router = useRouter();
  const { q } = router.query;
  const [url, setUrl] = useState((q as string) ?? "");

  const submitHandler = (event: FormEvent) => {
    event.preventDefault();
    if (url.includes("aliexpress.com/item/")) {
      const firstSplit = url.split("/item/");
      const secondSplit = firstSplit[1]?.split(".html");
      if (secondSplit)
        void router.push(`/aliexpress/product/${secondSplit[0]}`);
    } else {
      void router.push(`/aliexpress?q=${url}`);
    }
  };
  const t = useTranslations("AliexpressPage");

  return (
    <section className="px-4">
      <p className="my-2 text-center font-mono text-sm font-bold">
        {t("hereStartsEverything")}
      </p>
      <div className="flex items-center justify-center">
        <AliExpressLogo width={400} />
      </div>
      <h1 className="w-full select-none text-center font-mono text-4xl font-extrabold">
        <span className="bg-gradient-to-r from-amber-500 to-aliexpress bg-clip-text uppercase text-transparent">
          {t("betweenYourHands")}
        </span>
      </h1>

      <form
        onSubmit={submitHandler}
        className="flex w-full items-center justify-center"
      >
        <div className="mx-2 mt-8 w-full max-w-2xl lg:mx-auto lg:w-1/2">
          <SearchInput
            autocomplete={false}
            id="url"
            name="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="exemple: watch, xt92, coat ... or https://www.aliexpress.com/item/xxxxxxx"
            width="100%"
          />
        </div>
      </form>
    </section>
  );
};
