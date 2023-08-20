import React, { useEffect, useState } from "react";
import { Tabs, QRCode } from "antd";

export default function TableStepPreview({ data }) {
  const [tabsItem, setTabsItem] = useState([]);
  const [activeTabs, setActiveTabs] = useState(data[0].key);
  useEffect(() => {
    if (typeof data === "object") {
      const newTabsItem = data.map((table, index) => ({ label: table.key, key: index }));
      setTabsItem(newTabsItem);
    }
  }, []);

  const tabsOnChangeHandler = (event) => {
    setActiveTabs(tabsItem[event].label);
  };

  return (
    <div id="table-preview">
      {tabsItem.length && <Tabs defaultActiveKey="1" items={tabsItem} onChange={tabsOnChangeHandler} />}
      {data.map((table) => {
        if (table.key === activeTabs) {
          return Array.from({ length: table.count }).map((_, index) => (
            <QRCode
              key={index} // Unutmayın: Her QRCode bileşeni için benzersiz bir anahtar eklemelisiniz.
              errorLevel="H"
              value="https://ant.design/"
              icon="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
            />
          ));
        }
        return null; // Veya bir varsayılan değer döndürebilirsiniz.
      })}
    </div>

  );
}
