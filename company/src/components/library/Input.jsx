import React, { useRef, useState } from "react";
import classNames from "classnames";

export default function Input({
  label, description, type,
  onChange, value, className,
  placeholder, error, readOnly, name,
}) {
  const ref = useRef();
  const [focus, setFocus] = useState(false);
  const classname = classNames({
    "library-input": true,
    [className]: className,
    focus,
    error,
    "read-only": readOnly,
  });

  if (type === "number" && ref.current) {
    ref.current.addEventListener("keypress", (evt) => {
      // Only Numbers
      if (evt.which < 48 || evt.which > 57) {
        evt.preventDefault();
      }
    });
  }

  return (
    <div className={classname}>
      {label && <div className="library-input-label">{label}</div>}
      <div className="library-input-input-wrapper">
        <input
          placeholder={placeholder}
          name={name}
          ref={ref}
          readOnly={readOnly}
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
