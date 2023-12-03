import React, { useState, useEffect } from "react";
import { Steps } from "antd";
import { useRouter } from "next/router";
import QrGeneratorForm from "@/components/QrGeneratorForm";
import TableStepPreview from "@/components/TableStepPreview";
import COMPANY_SERVICE from "@/services/company";
import QrList from "@/components/QrList";
import { STORAGE } from "@/utils/browserStorage";
import Button from "@/components/library/Button";

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
  const [companyTables, setCompanyTables] = useState(false);

  const router = useRouter();

  const getQrCode = async () => {
    const response = await COMPANY_SERVICE.getQr();
    if (response.length && STORAGE.getLocal("isCompleteMenuBoard") === "false") {
      router.push("/");
    }
    setCompanyTables(response);
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
    <div className="table-page">
      <h3>Masalarım</h3>
      {companyTables.length < 1 && (
      <>
        <div className="step-container">
          <div className="steps-wrapper">
            <Steps current={currentStep} items={steps.map((item) => ({ key: item.title, description: item.description }))} />
          </div>
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
      {companyTables
      && (
      <div className="list-wrapper">
        <QrList data={companyTables} />
      </div>
      )}
    </div>
  );
}
