import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { Banner } from "~/components/shared";
import { api } from "~/utils/api";
import type { IMessage } from "~/types/index";

const AccountVerification = ({ token }: { token: string }) => {
  const [message, setMessage] = useState<IMessage>();
  const router = useRouter();
  const { status } = useSession();
  const verificationQuery = api.account.verification.useQuery({ token });

  useEffect(() => {
    if (verificationQuery.isLoading) {
      setMessage({ type: "warning", text: "Loading..." });
    } else if (verificationQuery.isError) {
      setMessage({ type: "error", text: verificationQuery.error.message });
    } else if (verificationQuery.data) {
      if (verificationQuery.data.success) {
        setMessage({ type: "success", text: verificationQuery.data.message });
        router.push("/account");
      } else {
        setMessage({ type: "error", text: verificationQuery.data.message });
      }
    }
  }, [router, verificationQuery]);

  return (
    <>
      {status === "authenticated" && message?.type && (
        <Banner type={message?.type} message={message?.text} />
      )}
    </>
  );
};

export default AccountVerification;
