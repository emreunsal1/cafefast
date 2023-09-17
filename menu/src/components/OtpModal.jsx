import React, { useState } from "react";
import { Button, Modal, Input } from "antd";

export default function OtpModal({ setModalIsOpen, submitClickHandler }) {
  const [code, setCode] = useState("");

  return (
    <Modal title="Basic Modal" open onOk={() => submitClickHandler(code)} onCancel={() => setModalIsOpen(false)}>
      <div className="otp-modal">
        <div className="title">Lütfen Telefonunuza gelen 1241241241 haneli kodu giriniz</div>
        <Input onChange={(e) => setCode(e.target.value)} placeholder="••••••••••••••••••••••••••" />
      </div>
    </Modal>
  );
}
