import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { TEXT_INPUT } from "~/config/design";

interface SearchInputProps {
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
  autocomplete?: boolean;
  width?: any;
}

export const SearchInput = ({
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
  autocomplete,
  width,
}: SearchInputProps) => {
  return (
    <div style={{ width }} className="relative inline">
      <input
        id={id}
        name={name}
        required={required}
        type="text"
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
        className={className ? className : TEXT_INPUT + " pr-8"}
        tabIndex={tabIndex}
        autoComplete={autocomplete ? "on" : "off"}
      />
      <button
        type="submit"
        className="absolute -top-0.5 right-2 cursor-pointer"
      >
        <MagnifyingGlassIcon className={`h-5 w-5 inline`} aria-hidden="true" />
      </button>
    </div>
  );
};
