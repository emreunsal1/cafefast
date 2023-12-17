import React, { useState } from "react";
import Button from "./library/Button";
import Input from "./library/Input";
import Checkbox from "./library/Checkbox";

export default function QrGeneratorForm({
  onSubmit,
}) {
  const [formData, setFormData] = useState([]);
  const [isDesksWithKeyActive, setIsDesksWithKeyActive] = useState(false);

  const inputOnChangeHandler = (e, index) => {
    const mockData = JSON.parse(JSON.stringify(formData));
    mockData[index][e.target.name] = e.target.value;
    setFormData(mockData);
  };

  const createResultData = () => {
    if (!isDesksWithKeyActive) {
      const resultDataWithoutKey = Array.from({ length: formData[0].count }).map((_, index) => (index + 1).toString());
      return resultDataWithoutKey;
    }
    let dataWithKey = [];
    formData.forEach((table) => {
      if (table.count && table.key.length) {
        const a = Array.from({ length: table.count }).map((_, _index) => `${table.key.toUpperCase()}${_index + 1}`);
        dataWithKey = dataWithKey.concat(a);
      }
    });
    return dataWithKey;
  };

  const plusButtonClickHandler = () => {
    setFormData((prev) => [...prev, {}]);
  };

  const nextStepHandler = () => {
    const resultData = createResultData(formData);
    onSubmit(resultData);
  };

  const checkboxChangeHandler = (e) => {
    setIsDesksWithKeyActive(e.target.checked);
    if (e.target.checked) {
      setFormData([{ key: "", count: 0 }]);
    }
  };

  const hasEmpty = formData.some((item) => {
    if (isDesksWithKeyActive) {
      return (!item.count || !item.key);
    }
    return !item.count;
  });

  return (
    <div className="qr-generator-form">
      <Checkbox
        value={isDesksWithKeyActive}
        label="Bölgeleri Aktif Et"
        description="Eğer kafenizde birden fazla bölge var ise A1,B1 gibi masa isimlendirmeleri yapmanıza yarar"
        onChange={checkboxChangeHandler}
      />
      <div className="form-wrapper">
        {!isDesksWithKeyActive && (
        <Input
          type="number"
          name="count"
          onChange={(e) => setFormData([{ key: "", count: e.target.value }])}
          label="İşletmedeki Masa Adedi"
          description="İlgili bölgede kaç tane masanız var ise onu giriniz"
          placeholder="10"
        />
        )}
        {isDesksWithKeyActive && (
          <div className="inputs-wrapper">
            {formData.map((item, index) => (
              <div className="inputs-row" key={index}>
                <Input
                  name="key"
                  value={item.key}
                  label="Bölge Kodu"
                  onChange={(e) => inputOnChangeHandler(e, index)}
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
                  onChange={(e) => inputOnChangeHandler(e, index)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="qr-generator-form-actions">
        <Button disabled={hasEmpty} variant="outlined" onClick={plusButtonClickHandler}>Bölge Ekle</Button>
        <Button disabled={hasEmpty} onClick={nextStepHandler}>Devam Et</Button>
      </div>
    </div>
  );
}
