/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { motion } from "framer-motion";

import Button from "@components/shared/Button";

const AccountHero = () => {
  return (
    <div className="h-screen py-24 md:py-36 mx-auto max-w-6xl flex items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
      >
        <div>
          <div
            className={`relative px-6 flex flex-col md:flex-row justify-between`}
          >
            <div className="z-20 md:basis-3/4">
              <h2 className="font-mono">
                Place an order after creating your free account.
              </h2>
              <h1 className="text-3xl sm:text-5xl font-bold z-50">
                Fill in your personal details, and have the package delivered to
                your city.
              </h1>
            </div>
            <div
              className={`z-0 relative flex justify-center items-center md:basis-1/4`}
            >
              <div className="absolute ltr:-rotate-[5deg] rtl:rotate-[5deg] bg-gradient-to-t blur-3xl rounded-3xl from-teal-600 to-indigo-600 ltr:left-64 ltr:md:-left-14 ltr:lg:-left-5 ltr:xl:left-5 -top-6 w-[160px] md:w-[300px] h-[220px] md:h-[400px] " />
              <div className="absolute ltr:-rotate-[5deg] rtl:rotate-[5deg] ltr:hover:-rotate-[4deg] rtl:hover:rotate-[4deg] transition-transform duration-200 ease-in ltr:left-72 ltr:md:-left-14 ltr:lg:-left-5 ltr:xl:left-5 -top-5 w-[150px] md:w-[300px]">
                <img
                  className="w-full"
                  src="/screenshots/reglini-tablet.png"
                  alt="reglini ui screenshot"
                  width={2000}
                />
              </div>
            </div>
          </div>
          <div className="p-6">
            <Link href={"/account"}>
              <Button variant="solid">To your account</Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AccountHero;
