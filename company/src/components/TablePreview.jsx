import React from "react";
import { QRCode } from "antd";
import COMPANY_SERVICE from "@/services/company";
import { useMessage } from "@/context/GlobalMessage";
import Button from "./library/Button";

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
        {data.map((item, index) => (
          <div key={item} className="table-qr-item">
            <QRCode
              key={index}
              className="table-qr-item-qr-image"
              errorLevel="H"
              value="https://ant.design/"
              icon="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
            />
            <p>{item}</p>
          </div>
        ))}
      </div>
      {allowToSave && <Button className="table-preview-save-button" onClick={updateCompanyTables}>Kaydet</Button>}
    </div>

  );
}
