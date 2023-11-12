import React from "react";
import classNames from "classnames";

export default function Button({
  variant, hmtlType, onClick, children, disabled, size,
}) {
  const classname = classNames({
    button: true,
    [variant]: variant,
    [size]: size,
  });
  return (
    <button
      type={hmtlType || "button"}
      id="Button"
      className={classname}
      disabled={disabled}
      onClick={onClick}
    >
      <span>{children}</span>
    </button>
  );
}
