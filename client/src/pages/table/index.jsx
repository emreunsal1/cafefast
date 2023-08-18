import React, { useState, useEffect } from "react";
import { Steps, Button } from "antd";
import QrGeneratorForm from "@/components/QrGeneratorForm";
import TableStepPreview from "@/components/TableStepPreview";

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

  useEffect(() => {
    console.log("qeGenerateData", typeof data);
  }, [data]);

  return (
    <div>
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

    </div>
  );
}
