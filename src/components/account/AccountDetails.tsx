import Title from "@components/shared/Title";
import { PADDING, ROUNDED, SHADOW } from "@config/design";
import {
  CheckBadgeIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

import { trpc } from "@utils/trpc";
import Edit from "./details/EditAccount";
import EditAddress from "./details/EditAddress";
import EditProfilePicture from "./details/EditProfilePicture";
import Loading from "../shared/Loading";
import Link from "next/link";
import Button from "@components/shared/Button";
import { useTranslations } from "next-intl";

const AccountDetails = () => {
  const profile = trpc.account.profile.useQuery();
  const t = useTranslations("AccountPage.details");

  return (
    <div className="mb-10">
      <Title title={t("title")} />
      <p className="mb-4 font-bold font-mono text-sm text-center">
        {t("subtitle")}
      </p>
      {profile.isLoading && (
        <div className="w-full flex justify-center items-center">
          <Loading size="medium" />
        </div>
      )}
      {profile.data && profile.data.user && (
        <dl
          className={`max-w-2xl m-auto truncate ${PADDING} ${SHADOW} ${ROUNDED} `}
        >
          <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 ">
            <dt className="text-sm font-bold lg:flex lg:items-center">
              {t("profilePicture.title")}
            </dt>
            <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
              <EditProfilePicture
                field={t("profilePicture.title")}
                value={profile.data.user.profile?.picture}
              />
            </dd>
          </div>
          <div className=" px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 ">
            <dt className="text-sm font-bold lg:flex lg:items-center">
              {t("username")}
            </dt>
            <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
              <Edit
                title={t("username")}
                field="name"
                type="text"
                value={profile.data.user.name}
              />
            </dd>
          </div>
          <div className=" px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 ">
            <dt className="text-sm font-bold lg:flex lg:items-center">
              {t("email")}
            </dt>
            <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
              {profile.data.user.email}
            </dd>
          </div>
          {profile.data.user.account === "CREDENTIALS" && (
            <div className=" px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 ">
              <dt className="text-sm font-bold lg:flex lg:items-center">
                {t("verified")}
              </dt>
              <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
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
          <div className=" px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 ">
            <dt className="text-sm font-bold lg:flex lg:items-center">
              {t("fullName")}
            </dt>
            <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
              <Edit
                title={t("fullName")}
                field="realName"
                type="text"
                value={profile.data.user.profile?.realName}
              />
            </dd>
          </div>
          <div className=" px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 ">
            <dt className="text-sm font-bold lg:flex lg:items-center">
              {t("phoneNumber")}
            </dt>
            <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
              <Edit
                title={t("phoneNumber")}
                field="phoneNumber"
                type="text"
                value={profile.data.user.profile?.phoneNumber}
              />
            </dd>
          </div>
          <div className=" px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 ">
            <dt className="text-sm font-bold lg:flex lg:items-center">
              {t("address.title")}
            </dt>
            <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
              <EditAddress field="address" value={profile.data.user.address} />
            </dd>
          </div>
          <div
            className={`border border-danger ${ROUNDED} px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}
          >
            <dt className="text-sm font-bold lg:flex lg:items-center">
              {t("deleteAccount")}
            </dt>
            <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
              <Link href="/account/delete">
                <Button variant="solid">Delete account</Button>
              </Link>
              <div className="text-xs font-bold text-danger mt-1">
                <ExclamationTriangleIcon className="h-5 w-5 inline mr-1" />
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
