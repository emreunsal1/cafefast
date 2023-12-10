import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

function Portal({ children, selector }) {
  const [foundSelectorElement, setFoundSelectorElement] = useState(null);

  useEffect(() => {
    setFoundSelectorElement(document.querySelector(selector));
  }, []);

  if (foundSelectorElement === null) {
    return null;
  }
  return ReactDOM.createPortal(children, foundSelectorElement);
}

export default Portal;
