import classNames from "classnames";
import React from "react";

export default function Icon({ name, onClick, className }) {
  const classname = classNames(`icon icon-${name}`, {
    [className]: !!className,
  });

  return (
    <i className={classname} onClick={onClick} />
  );
}
