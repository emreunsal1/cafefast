import React from "react";
import COMPANY_SERVICE from "@/services/company";
import { useMessage } from "@/context/GlobalMessage";
import Button from "./library/Button";
import QRCode from "./QRCode";

export default function TableStepPreview({ data, allowToSave, onSave }) {
  const message = useMessage();
  const updateCompanyTables = () => {
    COMPANY_SERVICE.updateQr(data);
    onSave();
    message.success("Masalarınız başarıyla oluşturuldu!");
  };

  return (
    <div className="table-preview">
      {allowToSave && <p>QR'lar oluştuğunda bu şekilde gözükecek</p>}
      <div className="table-preview-tables">
        {data.map((item) => (
          <div key={item} className="table-qr-item">
            <QRCode className="table-qr-item-qr-image" desk={item} />
            <p>{item}</p>
          </div>
        ))}
      </div>
      {allowToSave && <Button className="table-preview-save-button" onClick={updateCompanyTables}>Kaydet</Button>}
    </div>

  );
}
