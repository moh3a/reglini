import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import slugify from "slugify";

import SearchInput from "@components/shared/SearchInput";
import Title from "@components/shared/Title";

const MainSearch = () => {
  const [url, setUrl] = useState("");
  const router = useRouter();

  const submitHandler = async (event: FormEvent) => {
    event.preventDefault();
    if (url.includes("aliexpress.com/item/")) {
      const firstSplit = url.split("/item/");
      const secondSplit = firstSplit[1].split(".html");
      router.push(`/aliexpress/product/${secondSplit[0]}`);
    } else {
      const slug = slugify(url);
      router.push(`/aliexpress/search/${slug}`);
    }
  };

  return (
    <section>
      {/* <div className="flex justify-center items-center">
        <AliExpressLogo />
      </div> */}
      <p className="text-center text-sm font-bold font-mono my-2">
        Here starts everything
      </p>
      <Title title="Aliexpress between your hands" />
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
