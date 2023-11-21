import React from "react";
import ReactSelect from "react-select";

function Select({
  label, description, options, onChange, value, placeholder = "Seçiniz", disabled,
}) {
  return (
    <div className="library-select">
      {label && <div className="library-select-label">{label}</div>}
      <ReactSelect
        className="library-select-select-input"
        classNamePrefix="library-select-select-input"
        placeholder={placeholder}
        options={options}
        onChange={onChange}
        value={value}
        isDisabled={disabled}
      />
      {description && <div className="library-select-description">{description}</div>}
    </div>
  );
}

export default Select;
