import React, { useState } from "react";
import classNames from "classnames";
import { motion } from "framer-motion";
import { usePopper } from "react-popper";
import { useClickOutSide } from "@/hooks";

const DEFAULT_CONFIRM_OPTIONS = {
  confirmText: "",
  okText: "Onayla",
  cancelText: "Vazgeç",
  onOkClick: () => {},
  onCancelClick: () => {},
};

export default function Button({
  variant,
  hmtlType,
  onClick = () => {},
  children,
  disabled,
  size,
  fluid,
  className,
  confirmOptions,
}) {
  const classname = classNames("library-button", {
    [`variant-${variant}`]: variant, // filled (default) | outlined | red
    [`size-${size}`]: size,
    fluid: !!fluid,
    [className]: !!className,
  });

  const [confirmOpened, setConfirmOpened] = useState(false);
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [{ name: "arrow", options: { element: arrowElement } }, {
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

  const _confirmOptions = confirmOptions ? {
    ...DEFAULT_CONFIRM_OPTIONS,
    ...confirmOptions,
  } : false;

  const toggleConfirm = () => {
    setConfirmOpened((value) => !value);
  };

  const onClickHandler = _confirmOptions ? toggleConfirm : onClick;

  const confirmOkHandler = () => {
    toggleConfirm();
    _confirmOptions.onOkClick();
  };

  const confirmCancelHandler = () => {
    toggleConfirm();
    _confirmOptions.onCancelClick();
  };

  useClickOutSide(popperElement, () => {
    if (confirmOpened) {
      toggleConfirm();
    }
  });

  return (
    <>
      <motion.button
        ref={_confirmOptions ? setReferenceElement : undefined}
        whileTap={{ scale: 0.96 }}
        type={hmtlType || "button"}
        className={classname}
        disabled={disabled}
        onClick={onClickHandler}
      >
        {children}
      </motion.button>
      {_confirmOptions && confirmOpened && (
      <div className="library-button-confirm" ref={setPopperElement} style={styles.popper} {...attributes.popper}>
        <div ref={setArrowElement} className="library-button-confirm-arrow" style={styles.arrow} />
        <div className="library-button-confirm-text">
          <p>{_confirmOptions.confirmText}</p>
        </div>
        <div className="library-button-confirm-actions">
          <Button onClick={confirmOkHandler} size="xsmall">{_confirmOptions.okText}</Button>
          <Button onClick={confirmCancelHandler} size="xsmall" variant="outlined">{_confirmOptions.cancelText}</Button>
        </div>
      </div>
      )}
    </>
  );
}
