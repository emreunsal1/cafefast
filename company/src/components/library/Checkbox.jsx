/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react";
import classNames from "classnames";
import Icon from "./Icon";

export default function Checkbox({
  type = "checkbox", label, description, className, value, onChange,
}) {
  const classname = classNames({
    "library-checkbox": true,
    [className]: className,
    checked: value,
    [type]: true,
  });

  return (
    <div className={classname}>
      <label>
        <input
          checked={value}
          onChange={onChange}
          type={type}
        />
        <div className="library-checkbox-checkbox">
          <Icon name="checkmark" />
        </div>
        {label && (
        <div className="library-checkbox-label">
          <div className="library-checkbox-label-text">{label}</div>
          {description && <div className="library-checkbox-label-description">{description}</div>}
        </div>
        )}
      </label>
    </div>
  );
}
