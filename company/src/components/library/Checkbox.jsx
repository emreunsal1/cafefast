/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from "react";
import classNames from "classnames";

export default function Checkbox({
  type = "checkbox", label, className, value, onChange,
}) {
  const [focus, setFocus] = useState(false);
  const classname = classNames({ "library-input": true, [className]: className, focus });

  return (
    <div className={classname}>
      <label>
        {label && (
        <div className="library-input-label">
          {label}
        </div>
        )}
        <input checked={value} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} onChange={onChange} type={type} />
      </label>
    </div>
  );
}
