import React, { useRef, useState } from "react";
import {
  motion,
} from "framer-motion";
import classNames from "classnames";
import { useClickOutSide } from "@/hooks";

export default function Dropdown({
  className,
  buttonContent,
  items,
  menuPosition = "lefttoright",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const bodyRef = useRef(null);
  const wrapperClassname = classNames("library-dropdown", {
    [className]: !!className,
  });
  const bodyClassname = classNames("library-dropdown-body", {
    [`menu-position-${menuPosition}`]: true,
  });
  const triggerClassName = classNames("library-dropdown-button", {});
  const itemClassName = classNames("library-dropdown-body-item", {});

  const closeBody = () => setIsOpen(false);
  useClickOutSide(bodyRef, closeBody);

  return (
    <div ref={bodyRef} className={wrapperClassname}>
      <motion.div
        whileTap={{ scale: 0.95 }}
        className={triggerClassName}
        id="library-dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        {buttonContent}
      </motion.div>
      <motion.div
        animate={{ opacity: isOpen ? 1 : 0, visibility: isOpen ? "visible" : "hidden" }}
        id="library-dropdown-body"
        className={bodyClassname}
      >
        {items.map((item, key) => <div key={key} onClick={closeBody} className={itemClassName}>{item}</div>)}
      </motion.div>
    </div>
  );
}
