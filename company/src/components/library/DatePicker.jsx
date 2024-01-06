import React, { useEffect, useRef, useState } from "react";
import { tr } from "date-fns/locale";

import { DayPicker } from "react-day-picker";
import { usePopper } from "react-popper";

import { useDate } from "@/context/DateContext";
import { useClickOutSide } from "@/hooks";
import Input from "./Input";

export default function DatePicker({
  onChange, value, label, description,
}) {
  const { moment } = useDate();
  const [inputValue, setInputValue] = useState("");
  const [isPopperOpen, setIsPopperOpen] = useState(false);

  const popperRef = useRef(null);
  const [popperElement, setPopperElement] = useState(
    null,
  );

  const togglePopper = () => {
    setIsPopperOpen((_value) => !_value);
  };

  const popper = usePopper(popperRef.current, popperElement, {
    placement: "bottom-start",
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 4],
        },
      },
      {
        name: "preventOverflow",
        options: {
          padding: 15,
        },
      },
    ],
  });

  useEffect(() => {
    const formattedDate = moment(value);
    if (formattedDate.isValid()) {
      setInputValue(formattedDate.format("LL"));
    }
  }, [value]);

  const handleDaySelect = (date) => {
    onChange(date);
    togglePopper();
  };

  useClickOutSide(popperElement, togglePopper);

  return (
    <div className="library-date-picker">
      <div ref={popperRef}>
        <Input label={label} value={inputValue} description={description} onClick={togglePopper} />
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
            defaultMonth={value}
            selected={value}
            onSelect={handleDaySelect}
          />
        </div>
      )}
    </div>
  );
}
