import { Fragment, ReactNode } from "react";
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
          <Menu.Button className="h-6 w-6 cursor-pointer relative top-2">
            <EllipsisVerticalIcon className="w-6 h-6" aria-hidden="true" />
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
        <Menu.Items className="absolute right-1 w-40 md:w-52 mt-2 bg-gray-100 dark:bg-grim divide-y divide-gray-100 rounded-lg shadow-md">
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
