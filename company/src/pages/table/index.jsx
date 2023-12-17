import React, { useState, useEffect } from "react";
import { Steps } from "antd";
import { useRouter } from "next/router";
import QrGeneratorForm from "@/components/QrGeneratorForm";
import TableStepPreview from "@/components/TablePreview";
import COMPANY_SERVICE from "@/services/company";
import { STORAGE } from "@/utils/browserStorage";

export const TABLE_PAGE_STEPS = {
  CREATE: 0,
  PREVIEW: 1,
  DONE: 2,
};

export default function Index() {
  const steps = [{ title: "Masalarınızı Oluşturun" }, { title: "Ön İzleme" }];
  const [currentStep, setCurrentStep] = useState(TABLE_PAGE_STEPS.CREATE);
  const [newTables, setNewTables] = useState([]);
  const [companyTables, setCompanyTables] = useState(false);

  const router = useRouter();

  const getQrCode = async () => {
    const response = await COMPANY_SERVICE.getQr();
    if (response.length && !STORAGE.getLocal("isCompleteMenuBoard")) {
      router.push("/");
    }
    setCompanyTables(response);
  };

  useEffect(() => {
    getQrCode();
  }, []);

  const formSubmitHandler = (data) => {
    setNewTables(data);
    setCurrentStep(TABLE_PAGE_STEPS.PREVIEW);
  };

  const previewSubmitHandler = () => {
    setCompanyTables(newTables);
  };

  return (
    <div className="table-page">
      <h3>Masalarım</h3>
      {companyTables.length === 0 && (
      <div className="step-container">
        <div className="steps-wrapper">
          <Steps current={currentStep} items={steps} />
        </div>
          {currentStep === TABLE_PAGE_STEPS.CREATE && (
            <QrGeneratorForm
              onSubmit={formSubmitHandler}
            />
          )}
          {currentStep === TABLE_PAGE_STEPS.PREVIEW && <TableStepPreview allowToSave data={newTables} onSave={previewSubmitHandler} />}
      </div>
      )}
      {companyTables.length > 0 && (
        <div className="list-wrapper">
          <TableStepPreview data={companyTables} />
        </div>
      )}
    </div>
  );
}
