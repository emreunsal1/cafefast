import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { useClickOutSide } from "@/hooks";
import { AnimatePresence, motion } from "framer-motion";
import Portal from "./Portal";

export default function Popup({
  show, onClose, className, children,
}) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const popupRef = useRef();

  const bodyClassname = classNames("library-popup", {
    show,
  });

  const overlayClassname = classNames("library-popup-overlay", {
    [className]: !!className,
    show,
  });

  useClickOutSide(popupRef.current, onClose);

  const lockWebKitBodyScrolling = () => {
    const _scrollPosition = window.pageYOffset;
    setScrollPosition(_scrollPosition);
    window.document.body.style.overflow = "hidden";
    window.document.body.style.position = "fixed";
    window.document.body.style.top = `-${_scrollPosition}px`;
    window.document.body.style.width = "100%";
  };

  const unlockWebKitBodyScrolling = () => {
    window.document.body.style.removeProperty("overflow");
    window.document.body.style.removeProperty("position");
    window.document.body.style.removeProperty("top");
    window.document.body.style.removeProperty("width");
    if (scrollPosition) {
      window.scrollTo(0, scrollPosition);
    }
  };

  useEffect(() => {
    if (show) {
      lockWebKitBodyScrolling();
    } else {
      unlockWebKitBodyScrolling();
    }
  }, [show]);

  return (
    <Portal selector="#library-popup-portal">
      <AnimatePresence>
        {show && (
        <motion.div
          className={overlayClassname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, pointerEvents: "none" }}
        >
          <motion.div
            initial={{ opacity: 0, transform: "translate(0, -20px)" }}
            animate={{ opacity: 1, transform: "translate(0, 0)" }}
            exit={{ opacity: 0, transform: "translate(0, -20px)", pointerEvents: "none" }}
            ref={popupRef}
            className={bodyClassname}
          >
            {children}
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
}
