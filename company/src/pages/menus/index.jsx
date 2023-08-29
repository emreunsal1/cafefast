import React, { useEffect, useState } from "react";
import {
  Table, Space,
  Modal, Input,
  Button, message,
} from "antd";
import { useRouter } from "next/router";
import { MENU_SERVICE } from "../../services/menu";
import COMPANY_SERVICE from "@/services/company";
import Layout from "../../components/Layout";

export default function Menu() {
  const [menus, setMenus] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [newMenu, setNewMenu] = useState({ name: "", description: "" });
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (isUpdate !== false) {
      setIsModalOpen(true);
      const data = menus.find((menu) => menu._id === isUpdate);
      setNewMenu(data);
    }
  }, [isUpdate]);

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

  const updateClickHandler = async () => {
    const response = await MENU_SERVICE.update(isUpdate, { name: newMenu.name, description: newMenu.description });
    const filteredMenu = menus.filter((menu) => menu._id !== isUpdate);
    filteredMenu.push(response.data);
    setMenus(filteredMenu);
    setIsUpdate(false);
    setIsModalOpen(false);
  };

  const rowclickHandler = (menu) => {
    router.push(`/menus/${menu._id}`);
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

  const activeMenuChangeHandler = async (menuId) => {
    console.log("menu ıd", menuId);
    const response = await COMPANY_SERVICE.update({ activeMenu: menuId });
    console.log("active menu update", response.data);
    return response.data;
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
            onSelect: (record) => activeMenuChangeHandler(record._id),
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
            title="Description"
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
                <div onClick={() => setIsUpdate(record._id)}>update</div>
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
          <Button key="create" loading={loading} onClick={() => (!isUpdate ? createMenu() : updateClickHandler())}>
            {!isUpdate ? "add" : "update"}
          </Button>,
          <Button key="cancel" onClick={() => { setIsModalOpen(false); setIsUpdate(false); }}>Cancel</Button>,
        ]}
      >
        <div className="modal">
          <Input placeholder="Name" key="name" value={newMenu.name} onChange={(e) => setNewMenu({ ...newMenu, name: e.target.value })} />
          <Input
            placeholder="Description"
            key="desc"
            value={newMenu.description}
            onChange={(e) => setNewMenu({ ...newMenu, description: e.target.value })}
          />
        </div>
      </Modal>
    </div>
  );
}

Menu.getLayout = function getLayout(menu) {
  return (
    <Layout>
      {menu}
    </Layout>
  );
};
