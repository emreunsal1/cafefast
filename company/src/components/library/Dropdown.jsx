import React, { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import classNames from "classnames";
import { useClickOutSide } from "@/hooks";
import Icon from "./Icon";

export default function Dropdown({
  className,
  buttonContent,
  items,
  menuPosition = "lefttoright",
  chevron = true,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const bodyRef = useRef(null);
  const wrapperClassname = classNames("library-dropdown", {
    [className]: !!className,
    opened: isOpen,
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
        onClick={() => setIsOpen(!isOpen)}
      >
        {buttonContent}
        {chevron && <Icon name="up-chevron" />}
      </motion.div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, transform: "translate(0, -10px)", visibility: "hidden" }}
            animate={{ opacity: 1, transform: "translate(0, 0)", visibility: "visible" }}
            className={bodyClassname}
          >
            {items.map((item, key) => <div key={key} onClick={closeBody} className={itemClassName}>{item}</div>)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
