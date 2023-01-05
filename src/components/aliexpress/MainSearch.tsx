import { FormEvent, useState } from "react";
import { useRouter } from "next/router";

import SearchInput from "@components/shared/SearchInput";
import AliExpressLogo from "@components/shared/AliExpressLogo";

const MainSearch = () => {
  const router = useRouter();
  const { q } = router.query;
  const [url, setUrl] = useState((q as string) ?? "");

  const submitHandler = async (event: FormEvent) => {
    event.preventDefault();
    if (url.includes("aliexpress.com/item/")) {
      const firstSplit = url.split("/item/");
      const secondSplit = firstSplit[1].split(".html");
      router.push(`/aliexpress/product/${secondSplit[0]}`);
    } else {
      router.push(`/aliexpress?q=${url}`);
    }
  };

  return (
    <section>
      <p className="text-center text-sm font-bold font-mono my-2">
        Here starts everything
      </p>
      <div className="flex justify-center items-center">
        <AliExpressLogo width={400} />
      </div>
      <h1 className="select-none font-extrabold text-4xl font-mono w-full text-center">
        <span className="uppercase bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-aliexpress">
          between your hands
        </span>
      </h1>

      <form
        onSubmit={submitHandler}
        className="flex justify-center items-center w-full"
      >
        <div className="w-full mx-2 mt-8 max-w-2xl lg:mx-auto lg:w-1/2">
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

export default MainSearch;
