import React from "react";
import classNames from "classnames";

export default function Button({
  variant, hmtlType, onClick, children, disabled, size, fluid, className,
}) {
  const classname = classNames("library-button", {
    [variant]: variant, // filled (default) | outlined | red
    [size]: size,
    fluid: !!fluid,
    [className]: !!className,
  });
  return (
    <button
      type={hmtlType || "button"}
      className={classname}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
