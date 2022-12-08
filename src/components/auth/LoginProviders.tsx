import { signIn } from "next-auth/react";
import { PADDING, ROUNDED } from "@config/design";
import Button from "../shared/Button";

const LoginProviders = ({ providers }: { providers: any }) => {
  return (
    <div className="flex flex-col lg:py-6">
      {providers &&
        Object.values(providers).map((provider: any) => {
          if (provider.name === "credentials") return;
          if (provider.id === "google") {
            return (
              <div key={provider.name} className="my-1">
                <a target="_blank">
                  <Button
                    onClick={() => signIn(provider.id)}
                    tabIndex={5}
                    type="button"
                    className={` w-full font-bold text-center border-black bg-black text-white transition duration-500 ease-in-out transform hover:bg-gray-100 hover:text-black ${PADDING} ${ROUNDED} disabled:cursor-not-allowed disabled:border-0 disabled:bg-gray-500 `}
                  >
                    <i className="fab fa-google mr-2"></i>
                    Continue with Google
                  </Button>
                </a>
              </div>
            );
          }
          if (provider.id === "facebook") {
            return (
              <div key={provider.name} className="my-1">
                <a target="_blank">
                  <Button
                    onClick={() => signIn(provider.id)}
                    tabIndex={5}
                    type="button"
                    className={` w-full font-bold text-center border-facebook bg-facebook text-white transition duration-500 ease-in-out transform hover:bg-gray-100 hover:text-facebook ${PADDING} ${ROUNDED} disabled:cursor-not-allowed disabled:border-0 disabled:bg-gray-500 `}
                  >
                    <i className="fab fa-facebook-f mr-2"></i>
                    Continue with Facebook
                  </Button>
                </a>
              </div>
            );
          }
        })}
    </div>
  );
};

export default LoginProviders;
