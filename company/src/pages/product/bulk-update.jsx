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
      <h3>Toplu Ürün Düzenleme</h3>
      <BulkProductsTable />
    </div>
  );
}
