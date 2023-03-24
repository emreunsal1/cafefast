import React, { useEffect } from "react";
import USER_SERVICE from "../services/user";

export default function Index() {
  useEffect(() => {
    USER_SERVICE.me();
  }, []);

  return (
    <div>burası main page register veya login olduk yupiii!!</div>
  );
}
