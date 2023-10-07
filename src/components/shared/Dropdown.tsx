import { Fragment, type ReactNode } from "react";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

interface DropdownProps {
  parent?: ReactNode;
  items: ReactNode[];
}

export const Dropdown = ({ parent, items }: DropdownProps) => {
  return (
    <Menu as="div" className="relative z-100">
      {parent ?? (
        <div>
          <Menu.Button className="relative top-2 h-6 w-6 cursor-pointer">
            <EllipsisVerticalIcon className="h-6 w-6" aria-hidden="true" />
          </Menu.Button>
        </div>
      )}

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-1 mt-2 w-40 divide-y divide-gray-100 rounded-lg bg-gray-100 shadow-md dark:bg-grim md:w-52">
          {items.map((item, index) => (
            <div key={index} className="p-1">
              <Menu.Item>{item}</Menu.Item>
            </div>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
