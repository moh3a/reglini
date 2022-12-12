import Button from "@components/shared/Button";
import { TEXT_GRADIENT } from "@config/design";
import {
  CloudArrowDownIcon,
  PencilIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Address } from "@prisma/client";
import { useState } from "react";

const EditAddress = ({
  field,
  value,
}: {
  field: string;
  value: Address | null;
}) => {
  const ADDRESS = `${value?.streetName}, ${value?.commune} - ${value?.wilaya} ${value?.postalCode}`;
  const [edit, setEdit] = useState(false);
  const [state, setState] = useState({
    wilaya: value?.wilaya,
    daira: value?.daira,
    commune: value?.commune,
    post: value?.postalCode,
  });

  return (
    <>
      {edit ? (
        <form>
          <span className={TEXT_GRADIENT + " font-extrabold"}>TODO</span>
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
          <div>{ADDRESS}</div>
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

export default EditAddress;
