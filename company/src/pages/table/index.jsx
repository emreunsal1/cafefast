import React, { useState, useEffect } from "react";
import { Steps, Button } from "antd";
import { useRouter } from "next/router";
import QrGeneratorForm from "@/components/QrGeneratorForm";
import TableStepPreview from "@/components/TableStepPreview";
import COMPANY_SERVICE from "@/services/company";
import QrList from "@/components/QrList";
import { STORAGE } from "@/utils/browserStorage";

export default function Index() {
  const steps = [{
    title: "a",
    description: "masa alanları ve masa numaraları",
  }, {
    title: "b",
    description: "ön izleme",
  }];
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState([{ key: "", count: 0 }]);
  const [isExistQr, setIsExistQr] = useState(false);

  const router = useRouter();

  const getQrCode = async () => {
    const response = await COMPANY_SERVICE.getQr();
    if (response.length && STORAGE.getLocal("isCompleteMenuBoard") == "false") {
      router.push("/");
    }
    setIsExistQr(response);
  };
  useEffect(() => {
    getQrCode();
  }, []);

  const doneClickHandler = () => {
    if (typeof data === "string") {
      const senderData = Array.from({ length: data }).map((item, index) => index);
      COMPANY_SERVICE.updateQr(senderData);
      return;
    }
    let dataWithKey = [];
    data.forEach((table) => {
      if (table.count && table.key.length) {
        const a = Array.from({ length: table.count }).map((_, _index) => `${table.key.toUpperCase()}${_index + 1}`);
        dataWithKey = dataWithKey.concat(a);
      }
    });
    COMPANY_SERVICE.updateQr(dataWithKey);
  };

  return (
    <div>
      {isExistQr.length < 1 && (
      <>
        <div className="step-container">
          <Steps current={currentStep} items={steps.map((item) => ({ key: item.title, description: item.description }))} />
          {currentStep === 0 && (
          <QrGeneratorForm
            setCurrentStep={setCurrentStep}
            setData={setData}
            data={data}
          />
          )}
          {currentStep === 1 && <TableStepPreview data={data} />}
        </div>
        {currentStep === 1 && <Button onClick={doneClickHandler}>Done</Button> }
      </>
      )}
      {isExistQr
      && (
      <div className="list-wrapper">
        <QrList data={isExistQr} />
      </div>
      )}
    </div>
  );
}
