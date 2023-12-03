import {
  Switch,
} from "antd";
import React, { useState } from "react";
import Button from "./library/Button";
import Input from "./library/Input";
import Checkbox from "./library/Checkbox";

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
  const checkboxChangeHandler = (e) => {
    setIsExistKey(e.target.checked);
    if (e.target.checked) {
      setIsExistKey(e.target.checked);
      setData([{ key: "", count: 0 }]);
    }
  };

  return (
    <div className="qr-generator-form">
      <Checkbox
        value={isExistKey}
        label="Bölgeleri Aktif Et"
        description="Eğer kafenizde birden fazla bölge var ise A1,B1 gibi masa isimlendirmeleri yapmanıza yarar"
        onChange={checkboxChangeHandler}
      />
      <div className="form-wrapper">
        {!isExistKey && (
        <Input
          type="number"
          name="count"
          onChange={(e) => setData(e.target.value)}
          label="Bölgedeki Masa Adedi"
          description="İlgili bölgede kaç tane masanız var ise onu giriniz"
          placeholder="10"
        />
        )}
        {isExistKey && (
          <div className="inputs-wrapper">
            {data.map((item, index) => (
              <div className="inputs-row" key={index}>
                <Input
                  name="key"
                  value={item.key}
                  label="Bölge Kodu"
                  onChange={(e) => inputOnchangeHandler(e, index)}
                  placeholder="B"
                  description="Bölgenin kodunuz giriniz (B girerseniz masa adı şöyle gözükecek: B1)"
                />
                <Input
                  type="number"
                  name="count"
                  value={item.count}
                  placeholder="10"
                  label="Bölgedeki Masa Adedi"
                  description="İlgili bölgede kaç tane masanız var ise onu giriniz"
                  onChange={(e) => inputOnchangeHandler(e, index)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="qr-generator-form-actions">
        <Button variant="outlined" onClick={plusButtonClickHandler}>Bölge Ekle</Button>
        <Button onClick={nextStepHandler}>Devam Et</Button>
      </div>
    </div>
  );
}
