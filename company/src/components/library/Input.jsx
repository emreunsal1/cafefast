import React from "react";
import classNames from "classnames";

export default function Input({
  label, description, value, type, onChange, className, placeholder,
}) {
  const classname = classNames({ "library-input": true, [className]: className });

  return (
    <div className={classname}>
      {label && <div className="library-input-label">{label}</div>}
      <div className="library-input-input-wrapper">
        <input placeholder={placeholder} type={type} value={value} onChange={onChange} />
      </div>
      {description && <div className="library-input-description">{description}</div>}
    </div>
  );
}
