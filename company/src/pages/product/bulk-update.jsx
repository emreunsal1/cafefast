import React from "react";
import dynamic from "next/dynamic";

const BulkProductsTable = dynamic(
  () => import("../../components/BulkProductsTable"),
  {
    ssr: false,
  },
);

export default function BulkUpdate() {
  return (
    <div className="bulk-update">
      <BulkProductsTable />
    </div>
  );
}
