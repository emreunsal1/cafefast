import React from "react";
import { Card, Col } from "antd";
import { EditOutlined, DeleteTwoTone } from "@ant-design/icons";

export default function CampainCard({ data, setIsUpdate, deleteCampain }) {
  return (
    <Col span={8}>
      <Card
        title={data.name}
        bordered={false}
        actions={[
          <EditOutlined key="edit" onClick={() => setIsUpdate(data)} />,
          <DeleteTwoTone key="delete" onClick={() => deleteCampain(data._id)} />,
        ]}
      >
        {data.description}
      </Card>
    </Col>
  );
}
