import React, { useRef, useState } from "react";
import {
  Button, Col, Input, Row,
} from "antd";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { useMenu } from "@/context/MenuContext";

export default function CategorySideBarItem({ data, selectedCategoryId, onClick }) {
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState({ _id: data._id, order: data.order, name: data.name });
  const { updateCategory } = useMenu();
  const router = useRouter();
  const inputRef = useRef(null);

  const saveHandler = async () => {
    await updateCategory(router.query.menuId, editData);
    setIsEdit(false);
  };

  const editHandler = () => {
    console.log("inputRef.current :>> ", inputRef);
    // inputRef.current.focus();
    setIsEdit(true);
  };

  return (
    <div className="item" key={data._id}>
      <Row style={{ alignItems: "center" }}>
        <Col span={20}>
          {isEdit ? (
            <input
              ref={inputRef}
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            />
          )
            : (
              <div
                onClick={onClick}
                className="category-name"
                style={{ color: data._id === selectedCategoryId ? "red" : "black" }}
              >
                {data.name}
              </div>
            )}
        </Col>
        <Col span={4}>
          <Button
            type="primary"
            shape="circle"
            onClick={isEdit ? saveHandler : editHandler}
            icon={isEdit ? <SaveOutlined /> : <EditOutlined />}
          />
        </Col>
      </Row>
    </div>
  );
}
