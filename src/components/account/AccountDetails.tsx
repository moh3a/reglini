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

const AccountDetails = () => {
  const profile = trpc.account.profile.useQuery();

  return (
    <div className="mb-10">
      <Title title="Account Information" />
      <p className="mb-4 font-bold font-mono text-sm text-center">
        Personal details.
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
              Profile picture
            </dt>
            <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
              <EditProfilePicture
                field="profile picture"
                value={profile.data.user.profile?.picture}
              />
            </dd>
          </div>
          <div className=" px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 ">
            <dt className="text-sm font-bold lg:flex lg:items-center">
              Username
            </dt>
            <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
              <Edit
                field="username"
                type="text"
                value={profile.data.user.name}
              />
            </dd>
          </div>
          <div className=" px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 ">
            <dt className="text-sm font-bold lg:flex lg:items-center">Email</dt>
            <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
              {profile.data.user.email}
            </dd>
          </div>
          {profile.data.user.account === "CREDENTIALS" && (
            <div className=" px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 ">
              <dt className="text-sm font-bold lg:flex lg:items-center">
                Email address verified
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
              Full name
            </dt>
            <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
              <Edit
                field="full name"
                type="text"
                value={profile.data.user.profile?.realName}
              />
            </dd>
          </div>
          <div className=" px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 ">
            <dt className="text-sm font-bold lg:flex lg:items-center">
              Phone number
            </dt>
            <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
              <Edit
                field="phone number"
                type="text"
                value={profile.data.user.profile?.phoneNumber}
              />
            </dd>
          </div>
          <div className=" px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 ">
            <dt className="text-sm font-bold lg:flex lg:items-center">
              Address
            </dt>
            <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
              <EditAddress field="address" value={profile.data.user.address} />
            </dd>
          </div>
          <div
            className={`border border-danger ${ROUNDED} px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}
          >
            <dt className="text-sm font-bold lg:flex lg:items-center">
              Delete your account
            </dt>
            <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
              <Link href="/account/delete">
                <Button variant="solid">Delete account</Button>
              </Link>
              <div className="text-xs font-bold text-danger mt-1">
                <ExclamationTriangleIcon className="h-5 w-5 inline mr-1" />
                DANGER! All data will be permanently lost.
              </div>
            </dd>
          </div>
        </dl>
      )}
    </div>
  );
};

export default AccountDetails;
