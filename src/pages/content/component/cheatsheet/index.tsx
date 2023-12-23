import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

const shortcuts: {
  [key: string]: { key: string; description: string }[];
} = {
  extension: [
    {
      key: "Alt + P",
      description: "Toggle PBS on current domain",
    },
  ],
};

interface GenericModalProps {
  open: boolean;
  onClose: () => void;
}
const CheatSheet: React.FC<GenericModalProps> = ({ open, onClose }) => {
  const [isOpen, setIsOpen] = useState(open);

  React.useEffect(() => {
    setIsOpen(open);
  }, [open]);

  return (
    <Transition.Root show={isOpen} as={React.Fragment}>
      <Dialog
        id="shorty-app"
        as="div"
        className="tw-relative tw-z-10 tw-h-screen"
        onClose={onClose}
      >
        <Transition.Child
          as={React.Fragment}
          enter="tw-ease-out tw-duration-300"
          enterFrom="tw-opacity-0"
          enterTo="tw-opacity-100"
          leave="tw-ease-in tw-duration-200"
          leaveFrom="tw-opacity-100"
          leaveTo="tw-opacity-0"
        >
          <div className="tw-fixed tw-inset-0 tw-bg-gray-500 tw-bg-opacity-25 tw-transition-opacity" />
        </Transition.Child>

        <div className="tw-fixed tw-inset-0 tw-z-10 tw-w-screen tw-overflow-y-auto tw-p-1/2 sm:tw-p-6 md:tw-p-20">
          <Transition.Child
            as={React.Fragment}
            enter="tw-ease-out tw-duration-300"
            enterFrom="tw-opacity-0 tw-scale-95"
            enterTo="tw-opacity-100 tw-scale-100"
            leave="tw-ease-in tw-duration-200"
            leaveFrom="tw-opacity-100 tw-scale-100"
            leaveTo="tw-opacity-0 tw-scale-95"
          >
            {/* <Dialog.Panel className="tw-mx-auto tw-max-w-xl tw-transform tw-divide-y tw-divide-gray-100 tw-overflow-hidden tw-rounded-xl tw-shadow-2xl tw-ring-1 tw-ring-black tw-ring-opacity-5 tw-transition-all"> */}
            <Dialog.Panel className="tw-mx-auto tw-max-w-2xl tw-transform tw-divide-y tw-divide-gray-500 tw-divide-opacity-10 tw-overflow-hidden tw-rounded-xl tw-bg-opacity-70 bg-slate-900 tw-shadow-2xl tw-ring-1 tw-ring-black tw-ring-opacity-5 backdrop-blur-xl backdrop-filter tw-transition-all tw-p-2">
              <h1 className="tw-justify-center tw-text-4xl text-primary tw-font-extrabold">
                Shortcuts
              </h1>
              {/* <ul className="tw-pt-8 tw-space-y-2"> */}

              {Object.keys(shortcuts).map((key) => (
                <table key={key} className="tw-table-auto">
                  <thead>
                    <tr>
                      <th>Shortcut</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody className="tw-gap-y-2">
                    {shortcuts[key].map((item) => (
                      <tr key={item.key}>
                        <td className="align-left">
                          <kbd className="tw-mx-2 tw-items-center tw-justify-center tw-rounded tw-border bg-slate-900 tw-font-thin tw-text-white">
                            {item.key}
                          </kbd>
                        </td>
                        <td>
                          <div className="tw-flex tw-flex-1 tw-items-center tw-justify-between tw-truncate tw-rounded-r-md tw-border-b tw-border-r tw-border-t tw-border-gray-200 tw-bg-white">
                            <div className="tw-flex-1 tw-truncate tw-px-4 tw-py-2 tw-text-sm">
                              {item.description}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ))}

              {/* <ul className="tw-pt-8 tw-grid tw-grid-cols-2 tw-gap-5">
                {shortcuts.map((item) => (
                  <li
                    key={item.key}
                    className="tw-col-span-1 tw-flex tw-rounded-md tw-shadow-sm"
                  >
                    <div className="tw-flex tw-flex-1 tw-items-center tw-justify-between tw-truncate tw-rounded-r-md tw-border-b tw-border-r tw-border-t tw-border-gray-200 tw-bg-white">
                      <div className="tw-flex-1 tw-truncate tw-px-4 tw-py-2 tw-text-sm">
                        {item.description}
                      </div>
                    </div>
                    <kbd className="tw-mx-2 tw-items-center tw-justify-center tw-rounded tw-border bg-slate-900 tw-text-white tw-font-thin">
                      {item.key}
                    </kbd>
                  </li>
                ))}
              </ul> */}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default CheatSheet;
