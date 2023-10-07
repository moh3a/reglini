import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/outline";
import {
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
  useState,
} from "react";
import { TEXT_INPUT } from "~/config/design";

interface PasswordProps {
  id?: string;
  name?: string;
  value?: string;
  setValue?: Dispatch<SetStateAction<string>>;
  readOnly?: boolean;
  placeholder?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  tabIndex?: number;
  className?: string;
  required?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyUp?: () => void;
  width?: string | number;
}

export const PasswordInput = ({
  className,
  onBlur,
  onFocus,
  placeholder,
  readOnly,
  setValue,
  value,
  tabIndex,
  id,
  name,
  onChange,
  onKeyUp,
  required,
  width,
}: PasswordProps) => {
  const [hidden, setHidden] = useState(true);
  return (
    <div className="relative inline">
      <input
        id={id}
        name={name}
        required={required}
        type={hidden ? "password" : "text"}
        value={value}
        onChange={(e) =>
          setValue
            ? setValue(e.target.value)
            : onChange
            ? onChange(e)
            : console.log(e)
        }
        onBlur={onBlur}
        onFocus={onFocus}
        onKeyUp={onKeyUp}
        style={{ width }}
        readOnly={readOnly}
        placeholder={placeholder}
        className={className ? className : TEXT_INPUT}
        tabIndex={tabIndex}
        maxLength={16}
        minLength={6}
      />
      <div
        className="absolute -top-0.5 right-2 cursor-pointer"
        onClick={() => setHidden(!hidden)}
      >
        {hidden ? (
          <EyeSlashIcon className={`inline h-5 w-5`} />
        ) : (
          <EyeIcon className={`inline h-5 w-5`} />
        )}
      </div>
    </div>
  );
};
