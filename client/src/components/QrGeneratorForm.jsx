import {
  Form, Input, Switch, Button,
} from "antd";
import React, { useEffect, useState } from "react";

export default function QrGeneratorForm({ setCurrentStep, setData, data }) {
  const [isExistKey, setIsExistKey] = useState(false);
  const inputOnchangeHandler = (e, index) => {
    const mockData = JSON.parse(JSON.stringify(data));
    mockData[index][e.target.name] = e.target.value;
    setData(mockData);
  };
  const plusButtonClickHandler = () => {
    const hasEmpty = data.some((item) => (!item.count || !item.key));
    if (!hasEmpty) {
      setData((prev) => [...prev, {}]);
    }
  };
  const nextStepHandler = () => {
    if (data.length > 0) {
      setCurrentStep((prev) => prev + 1);
      return;
    }
    window.alert("en az bir alan zorunludur");
  };
  const switchChangeHandler = (checked) => {
    if (checked) {
      setIsExistKey(checked);
      setData([{ key: "", count: 0 }]);
    }
  };

  return (
    <div id="QrGeneratorForm">
      <Switch checked={isExistKey} onChange={switchChangeHandler} />
      <div className="form-wrapper">

        {!isExistKey && <Input type="Number" name="count" onChange={(e) => setData(e.target.value)} placeholder="Masa Sayısı" /> }
        {isExistKey && (
          <div className="inputs-wrapper">
            {data.map((item, index) => (
              <div className="inputs-row" key={index}>
                <Input
                  type="text"
                  name="key"
                  value={item.key}
                  onChange={(e) => inputOnchangeHandler(e, index)}
                  placeholder="Anahtar kelime (masa numarası başına gelebilecek harf)"
                />
                <Input
                  type="Number"
                  name="count"
                  value={item.count}
                  placeholder="Masa Sayısı"
                  onChange={(e) => inputOnchangeHandler(e, index)}
                />
              </div>
            ))}
            <Button onClick={plusButtonClickHandler}>Plus</Button>
          </div>

        )}
      </div>
      <Button onClick={nextStepHandler}>Devam Et</Button>
    </div>
  );
}
