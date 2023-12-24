/* eslint-disable no-new */
import React, { useEffect, useRef, useState } from "react";
import EasyQRCode from "easyqrcodejs";
import { MENU_URL } from "@/constants";
import { getLocal } from "@/utils/browserStorage";

const renderQR = (ref, desk) => {
  new EasyQRCode(ref.current, {
    text: `${MENU_URL}/${getLocal("companyID")}?desk=${desk}`,
    logo: "/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FcafeFastIcon.4249f026.png&w=640&q=75",
    width: 1000,
    height: 1000,
  });
};

function QRCode({ desk, className }) {
  const qrref = useRef();
  const [isCSR, setIsCSR] = useState(false);

  useEffect(() => {
    if (isCSR) {
      renderQR(qrref, desk);
    }
  }, [isCSR]);

  useEffect(() => {
    setIsCSR(true);
  }, []);

  return (
    <div className={className} ref={qrref} />
  );
}

export default QRCode;
