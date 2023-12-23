import React from "react";

interface Props {
  option: {
    value: string;
    label: string;
  };
  defaultChecked?: boolean;
  showLabel?: boolean;
  disabled?: boolean;
  onChange: (value: string) => void;
}

interface GenericProps extends Props {
  type: "checkbox" | "radio";
  option: {
    value: string;
    label: string;
  };
  defaultChecked?: boolean;
  showLabel?: boolean;
  onChange: (value: string) => void;
}

export const Radio: React.FC<Props> = ({
  defaultChecked,
  option,
  onChange,
}) => {
  return Generic({ type: "radio", defaultChecked, option, onChange });
};

export const Checkbox: React.FC<Props> = ({
  defaultChecked,
  option,
  onChange,
  showLabel,
  disabled = false,
}) => {
  return Generic({
    type: "checkbox",
    defaultChecked,
    option,
    onChange,
    showLabel,
    disabled,
  });
};

const Generic: React.FC<GenericProps> = ({
  type,
  defaultChecked,
  option,
  onChange,
  showLabel,
}) => {
  const [selected, setSelected] = React.useState(defaultChecked);

  return (
    <fieldset className="tw-mt-4 tw-items-center tw-flex-1">
      <legend className="tw-sr-only">Notification method</legend>
      <div className="tw-space-y-4">
        <div key={option.value} className="tw-flex tw-items-center">
          <input
            id={option.value}
            name={"option-" + option.value}
            type={type}
            value={option.value}
            checked={selected}
            defaultChecked={defaultChecked}
            className="tw-h-4 tw-w-4 tw-border-gray-300 tw-text-indigo-600 focus:tw-ring-indigo-600"
            onClick={() => {
              const isSelected = selected;

              setSelected(!isSelected);
              onChange(isSelected ? "" : option.value);
            }}
          />
          {showLabel && (
            <label
              htmlFor={option.value}
              className="tw-ml-3 tw-block tw-text-sm tw-font-medium tw-leading-6 tw-text-gray-900"
            >
              {option.label}
            </label>
          )}
        </div>
      </div>
    </fieldset>
  );
};
