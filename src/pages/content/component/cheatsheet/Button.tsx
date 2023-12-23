import clsx from "clsx";
import React from "react";

// interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
const SquareButton: React.FC<ButtonProps> = ({ children, ...props }) => {
  let { className } = props;

  if (className === undefined) {
    className = "";
  }

  return (
    <button
      className={clsx(
        "tw-rounded bg-primary tw-text-xs tw-font-semibold tw-text-gray-100 tw-shadow-sm tw-ring-1 tw-ring-inset tw-ring-gray-300 hover:bg-secondary tw-px-2",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export const Button = {
  Square: SquareButton,
};
