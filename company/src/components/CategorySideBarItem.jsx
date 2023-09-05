import React, { useRef, useState } from "react";
import {
  Button, Col, Row,
} from "antd";
import { EditOutlined, SaveOutlined, DeleteOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { useMenuDetail } from "../context/MenuContext";
import { CATEGORY_SERVICE } from "../services/menu";

export default function CategorySideBarItem({ data, selectedCategoryId, onClick }) {
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState({ _id: data._id, order: data.order, name: data.name });
  const { categories, updateCategory, setCategories } = useMenuDetail();
  const router = useRouter();
  const inputRef = useRef(null);

  const saveHandler = async () => {
    await updateCategory(router.query.menuId, editData);
    setIsEdit(false);
  };

  const editHandler = () => {
    setIsEdit(true);
  };

  const deleteHandler = () => {
    CATEGORY_SERVICE.deleteCategory(router.query.menuId, data._id);
    const filteredCategory = categories.filter((category) => category._id !== data._id);
    setCategories(filteredCategory);
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
          <Button
            type="primary"
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={deleteHandler}
          />
        </Col>
      </Row>
    </div>
  );
}
