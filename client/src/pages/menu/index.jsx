import React, { useEffect, useState } from "react";
import {
  Table, Space,
  Modal, Input,
  Button, message,
} from "antd";
import { useRouter } from "next/router";
import { MENU_SERVICE } from "../../services/menu";

export default function Menu() {
  const [menus, setMenus] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMenu, setNewMenu] = useState({ name: "", desc: "" });
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const getMenu = async () => {
    setLoading(true);
    const response = await MENU_SERVICE.get();
    setLoading(false);
    setMenus(response.data);
  };
  const deleteClickHandler = async (menuId) => {
    const response = await MENU_SERVICE.deleteMenu(menuId);
    if (response) {
      const clearedMenu = menus.filter((menu) => menu._id !== menuId);
      setMenus(clearedMenu);
    }
  };

  const rowclickHandler = (menu) => {
    router.push(`/menu/${menu._id}`);
  };

  const createMenu = async () => {
    setLoading(true);
    const { name, desc } = newMenu;
    if (!name.length) {
      messageApi.error("Name Is Required");
      return;
    }
    const response = await MENU_SERVICE.create(name, desc);
    setLoading(false);
    if (response.status !== 200) {
      messageApi.error("Not Created Menu :(");
      return;
    }
    setMenus([...menus, response.data]);
    setIsModalOpen(false);
  };
  useEffect(() => {
    getMenu();
  }, []);

  return (
    <div>
      {contextHolder}
      <div className="title">Menus</div>
      <div>
        <Table
          loading={loading}
          rowKey="_id"
          rowSelection={{
            type: "radio",
          }}
          dataSource={menus}
        >
          <Table.Column
            title="Name"
            key="name"
            render={(_, record) => (
              <Space>
                <div onClick={() => rowclickHandler(record)}>{record.name}</div>
              </Space>
            )}
          />
          <Table.Column
            title="description"
            key="description"
            render={(_, record) => (
              <Space>
                <div>{record.description}</div>
              </Space>
            )}
          />

          <Table.Column
            title="Action"
            key="action"
            render={(_, record) => (
              <Space size="middle">
                <div onClick={() => deleteClickHandler(record._id)}>delete</div>
              </Space>
            )}
          />

        </Table>
      </div>
      <div className="create-menu">
        <Button onClick={() => setIsModalOpen(true)}>Create Menu</Button>
      </div>
      <Modal
        title="Basic Modal"
        onCancel={() => setIsModalOpen(false)}
        open={isModalOpen}
        footer={[
          <Button key="create" loading={loading} onClick={() => createMenu()}>Add</Button>,
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>Cancel</Button>,
        ]}
      >
        <div className="modal">
          <Input placeholder="Name" key="name" onChange={(e) => setNewMenu({ ...newMenu, name: e.target.value })} />
          <Input placeholder="Description" key="desc" onChange={(e) => setNewMenu({ ...newMenu, desc: e.target.value })} />
        </div>
      </Modal>
    </div>
  );
}
