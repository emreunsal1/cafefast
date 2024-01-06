import React from "react";
import { Card } from "antd";
import { EditOutlined, DeleteTwoTone } from "@ant-design/icons";
import { useRouter } from "next/router";

export default function CampainCard({
  data, deleteCampain,
  campaignsToDelete,
  isMultipleDeleteActive,
  onMultipleSelectCheckboxClick,
}) {
  const router = useRouter();
  return (
    <div className="campaign-card">
      {isMultipleDeleteActive && (
      <input
        type="checkbox"
        checked={campaignsToDelete.includes(data._id)}
        onClick={() => onMultipleSelectCheckboxClick(data._id)}
      />
      )}
      <Card
        style={{
          width: 240,
        }}
        bordered={false}
        cover={<img alt="example" src={data.image} />}
        actions={[
          <EditOutlined key="edit" onClick={() => router.push(`campaigns/${data._id}`)} />,
          <DeleteTwoTone key="delete" onClick={() => deleteCampain(data._id)} />,
        ]}
      >
        {data.description}
      </Card>
    </div>
  );
}
