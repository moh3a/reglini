import Link from "next/link";
import { useTranslations } from "next-intl";

import Logo from "@components/shared/Logo";

const Footer = () => {
  const t = useTranslations("Common.footer");

  return (
    <footer className="relative">
      <hr className="h-px mt-6 mb-2 mx-6 md:mx-10 lg:mx-20 border-none bg-gray-300 dark:bg-gray-700" />

      <div className="container px-6 py-4 mx-auto">
        <div className={`lg:flex`}>
          <div className="w-full -mx-6 lg:flex-1">
            <div className="px-6 text-center">
              <h2 className="cursor-pointer text-xl font-bold">reglini-dz</h2>

              <h3 className=" mt-2 text-gray-500 dark:text-gray-400">
                {t("desc")}
              </h3>

              <div className="flex justify-center mt-4 -mx-2">
                <Link
                  href="https://www.facebook.com/reglini.dz"
                  rel="noreferrer"
                  target="_blank"
                >
                  <span
                    className="mx-2 text-blue-600 dark:text-white hover:text-blue-500 dark:hover:text-gray-100"
                    aria-label="Facebook"
                  >
                    <i className="fab fa-facebook-square"></i>
                  </span>
                </Link>

                <span
                  className="cursor-pointer mx-2 text-blue-400 dark:text-white hover:text-blue-300 dark:hover:text-gray-100"
                  aria-label="Messenger"
                >
                  <i className="fab fa-facebook-messenger"></i>
                </span>

                <Link
                  href="https://www.instagram.com/reglini.dz/"
                  rel="noreferrer"
                  target="_blank"
                >
                  <span
                    className="mx-2 text-pink-600 dark:text-white hover:text-pink-700 dark:hover:text-gray-100"
                    aria-label="Instagram"
                  >
                    <i className="fab fa-instagram"></i>
                  </span>
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-6 md:ml-16 lg:mt-0 lg:flex-1">
            <div className={`grid grid-cols-2 gap-6`}>
              <div>
                <h1 className="font-bold uppercase">{t("info")}</h1>
                <Link href="/support">
                  <div className="my-1 py-1 text-sm text-gray-500 dark:text-gray-400 hover:underline">
                    {t("support")}
                  </div>
                </Link>
                <Link href="/pp">
                  <div className="my-1 py-1 text-sm text-gray-500 dark:text-gray-400 hover:underline">
                    {t("pp")}
                  </div>
                </Link>
                <Link href="/tos">
                  <div className="my-1 py-1 text-sm text-gray-500 dark:text-gray-400 hover:underline">
                    {t("tos")}
                  </div>
                </Link>
              </div>

              <div>
                <h1 className="font-bold uppercase">{t("contact")}</h1>
                <div className="my-1 py-1 text-sm text-gray-500 dark:text-gray-400 hover:underline">
                  213540861775
                </div>
                <div className="my-1 py-1 text-sm text-gray-500 dark:text-gray-400 hover:underline">
                  support@reglini-dz.com
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-center">
          <Logo width="50" height="50" loading={false} />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
