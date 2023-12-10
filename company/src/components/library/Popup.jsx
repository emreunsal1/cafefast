import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { useClickOutSide } from "@/hooks";
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

  useClickOutSide(popupRef, onClose);

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

  if (!show) {
    return null;
  }

  return (
    <Portal selector="#library-popup-portal">
      <div className={overlayClassname}>
        <div ref={popupRef} className={bodyClassname}>
          {children}
        </div>
      </div>
    </Portal>
  );
}
