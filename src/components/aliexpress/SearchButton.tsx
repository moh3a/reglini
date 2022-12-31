/* eslint-disable @next/next/no-img-element */
import { FormEvent, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import Button from "@components/shared/Button";
import Modal from "@components/shared/Modal";
import { TEXT_INPUT } from "@config/design";
import { useRouter } from "next/router";

const SearchButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState("");
  const router = useRouter();

  const submitHandler = (event: FormEvent) => {
    event.preventDefault();
    if (url.includes("aliexpress.com/item/")) {
      const firstSplit = url.split("/item/");
      const secondSplit = firstSplit[1].split(".html");
      router.push(`/aliexpress/product/${secondSplit[0]}`);
    } else {
      router.push(`/aliexpress?q=${url}`);
    }
    setIsOpen(false);
    setUrl("");
  };

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        <span className="sr-only">search aliexpress</span>
        <MagnifyingGlassIcon className="h-5 w-5 inline" aria-hidden="true" />
      </Button>

      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        <form onSubmit={submitHandler} className="relative max-w-lg m-auto">
          <input
            className={`w-full py-1 pl-7 pr-7 ${TEXT_INPUT} `}
            placeholder="Search Aliexpress"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            autoComplete="off"
          />
          <div className="absolute top-1.5 left-1 select-none">
            <img
              src={"/AliexpressIcon.svg"}
              alt="aliexpress logo"
              height={20}
              width={20}
            />
          </div>
          <div className="absolute top-0 -right-1">
            <Button variant="outline" type="submit">
              <MagnifyingGlassIcon
                className="h-5 w-5 inline"
                aria-hidden="true"
              />
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default SearchButton;
