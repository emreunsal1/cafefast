import React from "react";
import { QRCode } from "antd";

export default function QrList({ data }) {
  return (
    <div>
      <div className="list">
        {data.map(() => (
          <QRCode
            errorLevel="H"
            value="https://ant.design/"
            icon="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
          />
        ))}
      </div>
    </div>
  );
}
