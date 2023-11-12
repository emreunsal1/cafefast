import React, { useState } from "react";
import classNames from "classnames";

export default function Input({
  label, description, value, type, onChange, className, placeholder, error, disabled,
}) {
  const [focus, setFocus] = useState(false);
  const classname = classNames({
    "library-input": true,
    [className]: className,
    focus,
    error,
    disabled,
  });

  return (
    <div className={classname}>
      {label && <div className="library-input-label">{label}</div>}
      <div className="library-input-input-wrapper">
        <input
          placeholder={placeholder}
          type={type}
          disabled={disabled}
          value={value}
          onChange={onChange}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
        />
      </div>
      {description && <div className="library-input-description">{description}</div>}
      {error && typeof error === "string" && <div className="library-input-error">{error}</div>}
    </div>
  );
}
