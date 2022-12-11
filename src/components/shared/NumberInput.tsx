import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { TEXT_INPUT } from "@config/design";

interface NumberInputProps {
  id?: string;
  name?: string;
  value?: number;
  setValue?: Dispatch<SetStateAction<number>>;
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
  width?: any;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

const NumberInput = ({
  className,
  onBlur,
  onFocus,
  onChange,
  onKeyUp,
  placeholder,
  readOnly,
  setValue,
  value,
  tabIndex,
  id,
  name,
  size,
  required,
  width,
  disabled,
  max,
  min,
  step,
}: NumberInputProps) => {
  return (
    <input
      id={id}
      name={name}
      required={required}
      type={"number"}
      value={value}
      onChange={(e) =>
        setValue
          ? setValue(parseFloat(e.target.value))
          : onChange
          ? onChange(e)
          : console.log(e)
      }
      style={{ width }}
      onBlur={onBlur}
      onFocus={onFocus}
      onKeyUp={onKeyUp}
      step={step}
      min={min}
      max={max}
      disabled={disabled}
      readOnly={readOnly}
      placeholder={placeholder}
      className={className ? className : TEXT_INPUT}
      tabIndex={tabIndex}
      size={size || undefined}
      maxLength={size || undefined}
    />
  );
};

export default NumberInput;
