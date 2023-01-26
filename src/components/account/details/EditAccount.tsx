import { FormEvent, HTMLInputTypeAttribute, useState } from "react";
import {
  CloudArrowDownIcon,
  PencilIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

import Button from "@components/shared/Button";
import TextInput from "@components/shared/Input";
import Banner from "@components/shared/Banner";
import { trpc } from "@utils/trpc";
import { IMessage } from "@reglini-types/index";

interface EditAccountProps {
  title: string;
  field: "name" | "realName" | "phoneNumber" | "picture";
  value: any;
  type: HTMLInputTypeAttribute;
  editHandler?: (args?: any) => void;
}

const Edit = ({ title, field, value, type, editHandler }: EditAccountProps) => {
  const [edit, setEdit] = useState(false);
  const [state, setState] = useState(value);
  const [message, setMessage] = useState<IMessage>();
  const editMutation = trpc.account.edit.useMutation();
  const utils = trpc.useContext();

  const submitHandler = async (event: FormEvent) => {
    event.preventDefault();
    if (editHandler) {
      editHandler();
    } else {
      if (state !== value) {
        await editMutation.mutateAsync(
          { field, value: state },
          {
            onSettled(data, error) {
              if (error) setMessage({ type: "error", text: error.message });
              if (data) {
                if (data.success) {
                  setMessage({ type: "success", text: data.message });
                  utils.account.profile.invalidate();
                } else setMessage({ type: "error", text: data.error });
              }
              setTimeout(
                () => setMessage({ type: undefined, text: undefined }),
                3000
              );
            },
          }
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
              className="block font-bold font-mono text-sm"
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
                <XMarkIcon className="inline h-5 w-5 mr-2" aria-hidden="true" />
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
                  className="inline h-5 w-5 mr-2"
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
              <PencilIcon className="inline h-5 w-5 mr-2" aria-hidden="true" />
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

export default Edit;
