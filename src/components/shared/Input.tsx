import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { TEXT_INPUT } from "~/config/design";

interface InputProps {
  id?: string;
  name?: string;
  type?: "text" | "url" | "email";
  value?: string;
  setValue?: Dispatch<SetStateAction<string>>;
  size?: number;
  readOnly?: boolean;
  placeholder?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyUp?: () => void;
  tabIndex?: number;
  className?: string;
  required?: boolean;
  autocomplete?: boolean;
  width?: string | number;
}

export const TextInput = ({
  className,
  onBlur,
  onFocus,
  onChange,
  onKeyUp,
  placeholder,
  readOnly,
  setValue,
  type,
  value,
  tabIndex,
  id,
  name,
  size,
  required,
  autocomplete,
  width,
}: InputProps) => {
  return (
    <input
      id={id}
      name={name}
      required={required}
      type={type ? type : "text"}
      value={value}
      onChange={(e) =>
        setValue
          ? setValue(e.target.value)
          : onChange
          ? onChange(e)
          : console.log(e)
      }
      style={{ width }}
      onBlur={onBlur}
      onFocus={onFocus}
      onKeyUp={onKeyUp}
      readOnly={readOnly}
      placeholder={placeholder}
      className={className ? className : TEXT_INPUT}
      tabIndex={tabIndex}
      size={size ?? undefined}
      maxLength={size ?? undefined}
      autoComplete={autocomplete ? "on" : "off"}
    />
  );
};
