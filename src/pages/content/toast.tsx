import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { INotifcation } from "./types";
import { imgSrc } from "../background/constantines";

interface ToastProps {
  open: boolean;
  onClose: () => void;
  notification: INotifcation;
}

const Toast: React.FC<ToastProps> = ({ open, onClose, notification }) => {
  const [show, setShow] = useState(open);

  return (
    <>
      <div
        id="shorty-app"
        className="tw-z-10 tw-h-screen"
        // className="tw-pointer-events-none tw-fixed tw-inset-0 tw-flex tw-items-end tw-px-4 tw-py-6 sm:tw-items-start sm:tw-p-6"
      >
        <div
          className="tw-pointer-events-none tw-absolute tw-inset-0 tw-flex tw-items-end tw-px-4 tw-py-6 sm:tw-items-start sm:tw-p-6 tw-z-10 tw-h-screen"
          // className="tw-pointer-events-none tw-fixed tw-inset-0 tw-flex tw-items-end tw-px-4 tw-py-6 sm:tw-items-start sm:tw-p-6"
        >
          <div className="tw-flex tw-w-full tw-flex-col tw-fixed tw-top-10 tw-right-5 tw-space-y-4 sm:tw-items-end">
            <Transition
              show={show}
              as={Fragment}
              enter="tw-transform tw-ease-out tw-duration-300 tw-transition"
              enterFrom="tw-translate-y-2 tw-opacity-0 sm:tw-translate-y-0 sm:tw-translate-x-2"
              enterTo="tw-translate-y-0 tw-opacity-100 sm:tw-translate-x-0"
              leave="tw-transition tw-ease-in tw-duration-100"
              leaveFrom="tw-opacity-100"
              leaveTo="tw-opacity-0"
            >
              <div className="tw-pointer-events-auto tw-w-full tw-max-w-sm tw-overflow-hidden tw-rounded-lg bg-primary tw-shadow-lg ring-accent tw-ring-2 tw-ring-opacity-80">
                <div className="tw-p-4">
                  <div className="tw-flex tw-items-start">
                    <div className="tw-flex-shrink-0">
                      <img
                        className="tw-h-6 tw-w-6"
                        src={`data:image/png;base64,${imgSrc}`}
                      />
                    </div>
                    <div className="tw-ml-3 tw-w-0 tw-flex-1 tw-pt-0.5">
                      <p className="text-md tw-font-medium tw-text-white">
                        {notification.Primary}
                      </p>
                      <p className="tw-mt-1 tw-text-sm tw-text-gray-300">
                        {notification.Secondary}
                      </p>
                    </div>
                    <div className="tw-ml-4 tw-flex tw-flex-shrink-0">
                      <button
                        type="button"
                        className="tw-inline-flex tw-rounded-md bg-secondary tw-text-gray-300 hover:tw-text-gray-200"
                        onClick={() => {
                          setShow(false);
                        }}
                      >
                        <span className="tw-sr-only">Close</span>
                        <XMarkIcon
                          className="tw-h-5 tw-w-5"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </>
  );
};

export default Toast;
