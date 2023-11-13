import { type FormEvent, useEffect, useState } from "react";
import {
  CloudArrowDownIcon,
  PencilIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import type { Address, Commune, Daira, Post, Wilaya } from "@prisma/client";
import {
  SelectPost,
  SelectCommune,
  SelectDaira,
  SelectWilaya,
} from "~/components/account/details/address";
import { Button, TextInput, Loading } from "~/components/shared";
import { api } from "~/utils/api";
import { useTranslations } from "next-intl";
import { useMessage } from "~/utils/store";

export const EditAddress = ({
  field,
  value,
}: {
  field: string;
  value: Address | null;
}) => {
  const ADDRESS = `${value?.streetName}, ${value?.commune} - ${value?.wilaya} ${value?.postalCode}`;

  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setTimedMessage } = useMessage();

  const [wilaya, setWilaya] = useState<Wilaya>();
  const [daira, setDaira] = useState<Daira>();
  const [commune, setCommune] = useState<Commune>();
  const [postalCode, setPostalCode] = useState<Post>();
  const [streetName, setStreetName] = useState<string>("");

  useEffect(() => {
    setDaira(undefined);
  }, [wilaya]);

  useEffect(() => {
    setCommune(undefined);
  }, [daira]);

  useEffect(() => {
    setPostalCode(undefined);
  }, [commune]);

  useEffect(() => {
    setStreetName("");
  }, [postalCode]);

  const utils = api.useContext();
  const addressMutation = api.account.address.useMutation();
  const submitHandler = (event: FormEvent) => {
    event.preventDefault();
    if (wilaya && daira && commune && postalCode && streetName) {
      setLoading(true);
      addressMutation.mutate(
        {
          wilaya: wilaya.name,
          daira: daira.name,
          commune: commune.name,
          postalCode: postalCode.zip_code,
          streetName,
        },
        {
          onSettled(data, error) {
            if (error)
              setTimedMessage({
                type: "error",
                text: error.message ?? "",
                duration: 3000,
              });
            if (data) {
              if (data.success) {
                setTimedMessage({
                  type: "success",
                  text: data.message ?? "",
                  duration: 3000,
                });
                void utils.account.profile.invalidate();
              } else
                setTimedMessage({
                  type: "error",
                  text: data.error ?? "",
                  duration: 3000,
                });
            }
          },
        },
      );
      setEdit(false);
      setLoading(false);
    } else {
      setTimedMessage({
        type: "error",
        text: "Fill all required fields to submit.",
        duration: 3000,
      });
    }
  };

  const t = useTranslations("AccountPage.details");

  return (
    <>
      {loading && (
        <span className="font-mono text-sm">
          <Loading size="small" /> {t("loading")}...
        </span>
      )}
      {edit ? (
        <form onSubmit={submitHandler}>
          <SelectWilaya wilaya={wilaya} setWilaya={setWilaya} />
          {wilaya && (
            <SelectDaira
              wilaya={wilaya.name}
              daira={daira}
              setDaira={setDaira}
            />
          )}
          {daira && (
            <SelectCommune
              daira={daira.name}
              commune={commune}
              setCommune={setCommune}
            />
          )}
          {commune && wilaya && (
            <SelectPost
              wilaya={wilaya.name}
              commune={commune.name}
              postalCode={postalCode}
              setPostalCode={setPostalCode}
            />
          )}
          {postalCode && (
            <div className="my-1">
              <div className="font-mono">{t("address.streetName")}</div>
              <TextInput
                value={streetName}
                setValue={setStreetName}
                width={"100%"}
              />
            </div>
          )}
          <div>
            <Button
              variant="outline"
              icon={
                <XMarkIcon className="mr-2 inline h-5 w-5" aria-hidden="true" />
              }
              onClick={() => setEdit(false)}
            >
              {t("cancel")}
            </Button>
          </div>
          <div>
            <Button
              variant="outline"
              icon={
                <CloudArrowDownIcon
                  className="mr-2 inline h-5 w-5"
                  aria-hidden="true"
                />
              }
              type="submit"
            >
              {t("save")} {field}
            </Button>
          </div>
        </form>
      ) : (
        <>
          <div>{ADDRESS}</div>
          <Button
            variant="outline"
            icon={
              <PencilIcon className="mr-2 inline h-5 w-5" aria-hidden="true" />
            }
            onClick={() => setEdit(true)}
          >
            {t("edit")} {field}
          </Button>
        </>
      )}
    </>
  );
};
