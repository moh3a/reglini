import { BG_TRANSPARENT_BACKDROP } from "~/config/design";
import { FolderOpenIcon } from "@heroicons/react/24/outline";
import { type ChangeEvent, useRef } from "react";

interface FileUploadProps {
  onChange: (formData: FormData) => void;
  uploadFileName: string;
}

const FileUpload = ({ onChange, uploadFileName }: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const onClickHandler = () => {
    fileInputRef.current?.click();
  };

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) {
      return;
    } else if (event.target.files?.length > 1) {
      formRef.current?.reset();
    } else {
      const formData = new FormData();
      Array.from(event.target.files).forEach((file) => {
        formData.append(event.target.name, file);
      });
      onChange(formData);
      formRef.current?.reset();
    }
  };

  return (
    <form ref={formRef}>
      <button
        className={`${BG_TRANSPARENT_BACKDROP} rounded-full p-2 font-bold`}
        type="button"
        onClick={onClickHandler}
      >
        <span className="sr-only">upload file</span>
        <FolderOpenIcon className="h-5 w-5 text-aliexpress" />
      </button>
      <input
        accept="image/*"
        name={uploadFileName}
        onChange={onChangeHandler}
        ref={fileInputRef}
        maxLength={1}
        style={{ display: "none" }}
        type="file"
      />
    </form>
  );
};

export default FileUpload;
