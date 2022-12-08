import { FormEvent, HTMLInputTypeAttribute, useState } from "react";
import {
  CloudArrowDownIcon,
  PencilIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import Button from "@components/shared/Button";
import TextInput from "@components/shared/Input";

const Edit = ({
  field,
  value,
  type,
  editHandler,
}: {
  field: string;
  value: any;
  type: HTMLInputTypeAttribute;
  editHandler?: (args?: any) => void;
}) => {
  const [edit, setEdit] = useState(false);
  const [state, setState] = useState(value);

  const submitHandler = async (event: FormEvent) => {
    event.preventDefault();
    if (editHandler) {
      editHandler();
    } else {
      console.log(state);
    }
  };

  return (
    <>
      {edit ? (
        <form onSubmit={submitHandler}>
          <div>
            <label className="block" htmlFor={field}>
              {field}
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
              cancel
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
              save {field}
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
            edit {field}
          </Button>
        </>
      )}
    </>
  );
};

export default Edit;
