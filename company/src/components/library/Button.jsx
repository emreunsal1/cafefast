import React from "react";
import classNames from "classnames";

export default function Button({
  variant, hmtlType, onClick, children, disabled, size, fluid,
}) {
  const classname = classNames("library-button", {
    [variant]: variant, // default filled | outlined
    [size]: size,
    fluid: !!fluid,
  });
  return (
    <button
      type={hmtlType || "button"}
      id="Button"
      className={classname}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
