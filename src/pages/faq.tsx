import { ReactNode, useState } from "react";
import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";

import { APP_NAME } from "@config/general";

const Item = ({ title, children }: { title: string; children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={` ${SHADOW} ${PADDING} ${ROUNDED}`}>
      <button
        type="button"
        aria-label="Open item"
        title="Open item"
        className="flex items-center justify-between w-full p-4 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <p className="text-lg font-bold">{title}</p>
        <div className="flex items-center justify-center w-8 h-8 border rounded-full">
          <svg
            viewBox="0 0 24 24"
            className={`w-3 transition-transform duration-200 ${
              isOpen ? "transform rotate-180" : ""
            }`}
          >
            <polyline
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeMiterlimit="10"
              points="2,7 12,17 22,7"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>
      {isOpen && (
        <div className="p-4 pt-0">
          <div>{children}</div>
        </div>
      )}
    </div>
  );
};

const FAQPage = () => {
  return (
    <>
      <Head>
        <title>{`FAQ | ${APP_NAME}`}</title>
      </Head>
      <div className="mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
        <div className="max-w-xl sm:mx-auto lg:max-w-2xl">
          <div className="flex flex-col mb-16 sm:text-center">
            <div className="max-w-xl md:mx-auto sm:text-center lg:max-w-2xl">
              <Title title="F.A.Q." />
            </div>
          </div>
          <div className="px-4 my-4 space-y-4">
            <Item title="What is the purpose of this app?">
              AliExpress is one of the biggest online retail services based in
              China that offer products to international online buyers. While
              algerians are starting to use it, it is yet to be mainstream. And
              that&apos;s for many reasons, one of which is harsh algerian
              customs that imposes many rules on product imports. Another reason
              is that AliExpress only accepts major foreign currencies as
              payments. That is why we offer you to purchase from AliExpress and
              have it shipped to your town, using the local algerian dinars.
            </Item>
            <Item title="Why order from reglini-dz?">
              There are several Algerian online services that take customer
              requests and take care of ordering and paying Aliexpress while
              receiving their payments in DZD. Basically this is also what
              reglini-dz does, but also allows a great user experience, who has
              full access to products, orders and package tracking. All this is
              automatic and without the need for intermediary help.
            </Item>
            <Item title="How does ordering from reglini-dz work?">
              <ul className="list-disc">
                <li>
                  First you find an item that you like, check if it can be
                  shipped to Algeria and at what price.
                </li>
                <li>
                  Select the properties of the item then add it to cart, or even
                  directly buy it.
                </li>
                <li>
                  Buying an item is submitting an order, that needs the real
                  legal name and the full correct address and phone number of
                  the buyer.
                </li>
                <li>
                  If all the informations are validated, an order is created.
                  The buyer then has 48 hours to submit a payment with the
                  order&apos;s total amount. If no payment was submitted in 48
                  hours, the order will be automatically cancelled.
                </li>
                <li>The payment should be once and with the total amount.</li>
                <li>
                  After the payment was submitted and validated, you can then
                  check the status of your order, and even see the tracking of
                  your item -if your product&apos;s carrier provides it.
                </li>
              </ul>
            </Item>
            <Item title="How to make a payment via CCP?">
              <p>
                At the counter of any post office, and on a unique SFP01 form
                available at the counter or{" "}
                <a
                  className="underline"
                  href="https://www.poste.dz/"
                  target="_blank"
                  rel="noreferrer"
                >
                  downloadable from the Internet
                </a>
                . The payment requires a description of the beneficiary&apos;s
                CCP account number and key on the SFP01 and a cash remittance of
                the payment amount at the counter.
              </p>
              <br />
              <div className="font-bold">
                <p>Name: AIT ABDELMALEK MOHAMED ALI</p>
                <p>CCP number and key: 0020008646 key 02</p>
              </div>
            </Item>
            <Item title="How does a transaction via CIB work?">
              <p>
                If you have a CIB, you can make payments online safely and
                reliably. And for each payment transaction made using the card,
                a payment receipt is issued to the customer. The payment receipt
                contains information relating to the payment transaction carried
                out as well as other information generated by the system and
                giving indications on the progress of the transaction. This
                receipt must be taken in screenshot by the customer and be sent
                as much payment at the level of the reglini-dz order.
              </p>
              <br />
              <p>
                All you need to complete the transaction is the RIB of the
                account you are going to pay.
              </p>
              <p className="font-bold">RIB: 007 99999 0020008646 02</p>
            </Item>
            <Item title="Products authorized for import">
              <p>
                You should know that the laws differ from one country to
                another, what can be authorized in one country is not
                necessarily authorized in the other, and your purchase could
                then be blocked at the level of the Algerian customs. Therefore,
                avoid any product that may constitute a danger to others or
                endanger national security.
              </p>
              <p>
                For a complete list of goods prohibited or suspended from
                importation,{" "}
                <a
                  target="_blank"
                  href={`https://www.douane.gov.dz/spip.php?article104&lang=fr`}
                  rel="noreferrer"
                  className="underline"
                >
                  visit the official site of the Algerian customs.
                </a>
              </p>
            </Item>
            <Item title="How long does shipping take?">
              Delivery typically takes less than 30 days for products over 20
              euros to almost 2 months for products under 5 euros.
            </Item>
            <p className="text-base text-center md:text-lg">
              Want to ask another question? You can do that from{" "}
              <Link href="/support" passHref>
                <div className="cursor-pointer text-gray-500 dark:text-gray-400">
                  this page.
                </div>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const messages = (await import(`../../locales/${locale}/FAQPage.json`))
    .default;
  return {
    props: {
      messages,
    },
  };
};

import Layout from "@components/layout/Layout";
import { PADDING, ROUNDED, SHADOW } from "@config/design";
import Title from "@components/shared/Title";
FAQPage.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default FAQPage;
