import React, { useRef, useState } from "react";
import { isValid } from "date-fns";
import { tr } from "date-fns/locale";

import { DayPicker } from "react-day-picker";
import { usePopper } from "react-popper";

import { useDate } from "@/context/DateContext";
import Input from "./Input";

export default function DatePicker({ onChange }) {
  const [selected, setSelected] = useState();
  const { formatDate, parseDate, moment } = useDate();
  const [inputValue, setInputValue] = useState("");
  const [isPopperOpen, setIsPopperOpen] = useState(false);

  const popperRef = useRef(null);
  const [popperElement, setPopperElement] = useState(
    null,
  );

  const closePopper = () => {
    setIsPopperOpen(false);
  };

  const popper = usePopper(popperRef.current, popperElement, {
    placement: "bottom-start",
  });

  const handleInputChange = (e) => {
    setInputValue(e.currentTarget.value);
    const date = parseDate(e.currentTarget.value, "LL");
    if (isValid(date)) {
      setSelected(date);
    } else {
      setSelected(undefined);
    }
  };

  const handleButtonClick = () => {
    setIsPopperOpen(true);
  };

  const handleDaySelect = (date) => {
    setSelected(date);
    if (date) {
      onChange(moment(date));
      setInputValue(formatDate(date, "LL"));
      closePopper();
    } else {
      setInputValue("");
    }
  };

  // useClickOutSide(popperElement, closePopper);

  return (
    <div className="library-date-picker">
      <div ref={popperRef}>
        <Input readOnly value={inputValue} onChange={handleInputChange} onClick={handleButtonClick} />
      </div>
      {isPopperOpen && (
        <div
          tabIndex={-1}
          className="library-date-picker-picker-dialog"
          style={popper.styles.popper}
          {...popper.attributes.popper}
          ref={setPopperElement}
          role="dialog"
          aria-label="DayPicker calendar"
        >
          <DayPicker
            initialFocus={isPopperOpen}
            mode="single"
            locale={tr}
            defaultMonth={selected}
            selected={selected}
            onSelect={handleDaySelect}
          />
        </div>
      )}
    </div>
  );
}
