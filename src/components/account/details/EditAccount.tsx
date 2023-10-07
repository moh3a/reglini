import { type FormEvent, type HTMLInputTypeAttribute, useState } from "react";
import {
  CloudArrowDownIcon,
  PencilIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

import { Button, TextInput, Banner } from "~/components/shared";
import { api } from "~/utils/api";
import type { IMessage } from "~/types/index";

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
  const [message, setMessage] = useState<IMessage>();
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
              if (error) setMessage({ type: "error", text: error.message });
              if (data) {
                if (data.success) {
                  setMessage({ type: "success", text: data.message });
                  void utils.account.profile.invalidate();
                } else setMessage({ type: "error", text: data.error });
              }
              setTimeout(
                () => setMessage({ type: undefined, text: undefined }),
                3000,
              );
            },
          },
        );
      }
    }
  };
  const t = useTranslations("AccountPage.details");

  return (
    <>
      {message?.type && <Banner type={message?.type} message={message?.text} />}
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
