import React, { useRef } from "react";
import RcTimePicker from "rc-time-picker";
import { useDate } from "@/context/DateContext";

export default function TimePicker({
  showHour, showMinute, showSecond = false, onChange, value,
}) {
  const { moment } = useDate();
  const defaultValue = useRef(moment().set("hour", 0).set("minute", 0));

  return (
    <RcTimePicker
      defaultValue={defaultValue.current}
      className="library-time-picker"
      showHour={showHour}
      showMinute={showMinute}
      showSecond={showSecond}
      onChange={onChange}
      value={value || defaultValue.current}
      minuteStep={10}
    />
  );
}
