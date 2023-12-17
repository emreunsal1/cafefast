import React from "react";
import classNames from "classnames";
import { motion } from "framer-motion";

export default function Button({
  variant, hmtlType, onClick, children, disabled, size, fluid, className,
}) {
  const classname = classNames("library-button", {
    [variant]: variant, // filled (default) | outlined | red
    [size]: size,
    fluid: !!fluid,
    [className]: !!className,
  });
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      type={hmtlType || "button"}
      className={classname}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}
