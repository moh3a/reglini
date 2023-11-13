import { type FormEvent, type HTMLInputTypeAttribute, useState } from "react";
import {
  CloudArrowDownIcon,
  PencilIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

import { Button, TextInput } from "~/components/shared";
import { api } from "~/utils/api";
import { useMessage } from "~/utils/store";

interface EditAccountProps {
  title: string;
  field: "name" | "realName" | "phoneNumber" | "picture";
  value: string;
  type: HTMLInputTypeAttribute;
  editHandler?: (args?: unknown) => void;
}

export const Edit = ({
  title,
  field,
  value,
  type,
  editHandler,
}: EditAccountProps) => {
  const [edit, setEdit] = useState(false);
  const [state, setState] = useState(value);
  const { setTimedMessage } = useMessage();
  const editMutation = api.account.edit.useMutation();
  const utils = api.useContext();

  const submitHandler = (event: FormEvent): void => {
    event.preventDefault();
    if (editHandler) {
      editHandler();
    } else {
      if (state !== value) {
        editMutation.mutate(
          { field, value: state },
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
      }
    }
  };
  const t = useTranslations("AccountPage.details");

  return (
    <>
      {edit ? (
        <form onSubmit={submitHandler}>
          <div>
            <label
              className="block font-mono text-sm font-bold"
              htmlFor={field}
            >
              {title}
            </label>
            {type === "text" && (
              <TextInput id={field} value={state} setValue={setState} />
            )}
          </div>
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
              {t("save")} {title}
            </Button>
          </div>
        </form>
      ) : (
        <>
          <div>{value}</div>
          <Button
            variant="outline"
            icon={
              <PencilIcon className="mr-2 inline h-5 w-5" aria-hidden="true" />
            }
            onClick={() => setEdit(true)}
          >
            {t("edit")} {title}
          </Button>
        </>
      )}
    </>
  );
};
