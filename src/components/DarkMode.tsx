import { useTheme } from "next-themes";
import { Switch } from "@headlessui/react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

const DarkMode = () => {
  const { theme, setTheme } = useTheme();
  return (
    <Switch
      checked={theme === "dark" ? true : false}
      onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={`bg-grim dark:bg-white relative bottom-0.5 inline-flex w-14 h-7 items-center rounded-full`}
    >
      <span className="sr-only">Toggle Dark Mode</span>
      <div
        className={`${
          theme === "dark"
            ? "ltr:translate-x-7 rtl:-tranlate-x-1"
            : "ltr:translate-x-1 rtl:-translate-x-7"
        } inline-block h-6 w-6 transform transition ease-in-out duration-200 rounded-full`}
      >
        {theme === "dark" ? (
          <MoonIcon className="text-aliexpress h-6 w-6" />
        ) : (
          <SunIcon className="text-aliexpress/[0.8] h-6 w-6" />
        )}
      </div>
    </Switch>
  );
};

export default DarkMode;
