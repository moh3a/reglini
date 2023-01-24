/* eslint-disable @next/next/no-img-element */
import Button from "@components/shared/Button";
import Link from "next/link";

const CurrencyHero = () => {
  return (
    <div className="h-screen py-24 md:py-36 mx-auto max-w-6xl flex items-center">
      <div>
        <div className={`relative p-6 sm:flex sm:flex-row sm:justify-between`}>
          <div
            className={`z-0 hidden sm:relative sm:flex justify-center items-center basis-1/6 md:basis-1/4`}
          >
            <div className="absolute ltr:rotate-[5deg] rtl:-rotate-[5deg] bg-gradient-to-br blur-3xl rounded-3xl from-sky-500 to-cyan-300 ltr:sm:-left-10 ltr:lg:-left-20 -top-10 h-[520px] w-[250px]" />
            <div className="absolute ltr:rotate-[5deg] rtl:-rotate-[5deg] ltr:hover:rotate-[6deg] rtl:hover:-rotate-[6deg] transition-transform duration-200 ease-in ltr:sm:-left-10 ltr:lg:-left-20 -top-5 w-[220px]">
              <img
                className="w-full"
                src="/screenshots/reglini-android.png"
                alt="reglini ui screenshot"
                height={2000}
              />
            </div>
          </div>
          <div className="text-right z-20 basis-5/6 md:basis-3/4">
            <h2 className="font-mono">What is the price conversion rate?</h2>
            <h1 className="text-5xl font-bold z-50">
              Stay up to date with the foreign currency exchange rates in the
              algerian market
            </h1>
          </div>
        </div>
        <div className="p-6 flex justify-end">
          <Link href={"/currency"}>
            <Button variant="solid">Check the rates!</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CurrencyHero;
