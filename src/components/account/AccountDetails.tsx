import Link from "next/link";
import {
  CheckBadgeIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

import { PADDING, ROUNDED, SHADOW } from "~/config/design";
import { api } from "~/utils/api";
import {
  Edit,
  EditAddress,
  EditProfilePicture,
} from "~/components/account/details";
import { Loading, Title, Button } from "~/components/shared";
import { useMessage } from "~/utils/store";

const AccountDetails = () => {
  const { setTimedMessage } = useMessage();
  const profile = api.account.profile.useQuery(undefined, {
    onSettled(data, error) {
      if (error)
        setTimedMessage({
          type: "error",
          text: "Account details fetch error.",
          duration: 3000,
        });
      if (data && !data.success)
        setTimedMessage({
          type: "error",
          text: data.error ?? "",
          duration: 3000,
        });
    },
  });
  const t = useTranslations("AccountPage.details");

  return (
    <div className="mb-10">
      <Title center={true} title={t("title")} />
      <p className="mb-4 text-center font-mono text-sm font-bold">
        {t("subtitle")}
      </p>
      {profile.isLoading && (
        <div className="flex w-full items-center justify-center">
          <Loading size="medium" />
        </div>
      )}
      {profile.data && profile.data.user && (
        <dl
          className={`m-auto max-w-2xl truncate ${PADDING} ${SHADOW} ${ROUNDED} `}
        >
          {profile.data.user.profile?.picture && (
            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 ">
              <dt className="text-sm font-bold lg:flex lg:items-center">
                {t("profilePicture.title")}
              </dt>
              <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                <EditProfilePicture
                  field={t("profilePicture.title")}
                  value={profile.data.user.profile?.picture}
                />
              </dd>
            </div>
          )}
          {profile.data.user.name && (
            <div className=" px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 ">
              <dt className="text-sm font-bold lg:flex lg:items-center">
                {t("username")}
              </dt>
              <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                <Edit
                  title={t("username")}
                  field="name"
                  type="text"
                  value={profile.data.user.name}
                />
              </dd>
            </div>
          )}
          <div className=" px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 ">
            <dt className="text-sm font-bold lg:flex lg:items-center">
              {t("email")}
            </dt>
            <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
              {profile.data.user.email}
            </dd>
          </div>
          {profile.data.user.account === "CREDENTIALS" && (
            <div className=" px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 ">
              <dt className="text-sm font-bold lg:flex lg:items-center">
                {t("verified")}
              </dt>
              <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                {profile.data.user.verified === true ? (
                  <CheckBadgeIcon
                    className="h-6 w-6 text-success"
                    aria-hidden="true"
                  />
                ) : (
                  <XCircleIcon
                    className="h-6 w-6 text-danger"
                    aria-hidden="true"
                  />
                )}
              </dd>
            </div>
          )}
          {profile.data.user.profile?.realName && (
            <div className=" px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 ">
              <dt className="text-sm font-bold lg:flex lg:items-center">
                {t("fullName")}
              </dt>
              <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                <Edit
                  title={t("fullName")}
                  field="realName"
                  type="text"
                  value={profile.data.user.profile?.realName}
                />
              </dd>
            </div>
          )}
          {profile.data.user.profile?.phoneNumber && (
            <div className=" px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 ">
              <dt className="text-sm font-bold lg:flex lg:items-center">
                {t("phoneNumber")}
              </dt>
              <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                <Edit
                  title={t("phoneNumber")}
                  field="phoneNumber"
                  type="text"
                  value={profile.data.user.profile?.phoneNumber}
                />
              </dd>
            </div>
          )}
          <div className=" px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 ">
            <dt className="text-sm font-bold lg:flex lg:items-center">
              {t("address.title")}
            </dt>
            <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
              <EditAddress field="address" value={profile.data.user.address} />
            </dd>
          </div>
          <div
            className={`border border-danger ${ROUNDED} px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}
          >
            <dt className="text-sm font-bold lg:flex lg:items-center">
              {t("deleteAccount")}
            </dt>
            <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
              <Link href="/account/delete">
                <Button variant="solid">Delete account</Button>
              </Link>
              <div className="mt-1 text-xs font-bold text-danger">
                <ExclamationTriangleIcon className="mr-1 inline h-5 w-5" />
                {t("danger")}
              </div>
            </dd>
          </div>
        </dl>
      )}
    </div>
  );
};

export default AccountDetails;
