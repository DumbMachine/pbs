import clsx from "clsx";
import React from "react";

import "@assets/styles/tailwind.css";

import { Switch } from "@headlessui/react";

interface GenericSwitchProps {
  on: boolean;
  disabled?: boolean;
  onClick: (val: boolean) => void;
}
export const GenericSwitch: React.FC<GenericSwitchProps> = ({
  on,
  onClick,
  disabled = false,
}) => {
  const [enabled, setEnabled] = React.useState(on);

  React.useEffect(() => {
    setEnabled(on);
  }, [on]);

  return (
    <Switch
      disabled={disabled}
      checked={enabled}
      onChange={(checked) => {
        setEnabled(checked);
        onClick(checked);
      }}
      className={clsx(
        enabled ? "tw-bg-indigo-600" : "tw-bg-gray-200",
        "tw-relative tw-inline-flex tw-h-6 tw-w-11 tw-flex-shrink-0 tw-cursor-pointer tw-rounded-full tw-border-2 tw-border-transparent tw-transition-colors tw-duration-200 tw-ease-in-out focus:tw-outline-none focus:tw-ring-0"
      )}
    >
      <span
        aria-hidden="true"
        className={clsx(
          enabled ? "tw-translate-x-5" : "tw-translate-x-0",
          "tw-pointer-events-none tw-inline-block tw-h-5 tw-w-5 tw-transform tw-rounded-full tw-bg-white tw-shadow tw-ring-0 tw-transition tw-duration-200 tw-ease-in-out"
        )}
      />
    </Switch>
  );
};
