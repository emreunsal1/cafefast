import React, { useEffect, useRef, useState } from "react";
import {
  Table, Space,
  Modal, Input,
} from "antd";
import { useRouter } from "next/router";
import { MENU_SERVICE } from "../../services/menu";
import COMPANY_SERVICE from "@/services/company";
import { STORAGE } from "@/utils/browserStorage";
import { useProduct } from "@/context/ProductContext";
import USER_SERVICE from "@/services/user";
import Button from "@/components/library/Button";
import Checkbox from "@/components/library/Checkbox";
import { useMessage } from "@/context/GlobalMessage";

export default function Menu() {
  const [menus, setMenus] = useState([]);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectModeActive, setSelectModeActive] = useState(false);
  const [selectedMenuIds, setSelectedMenuIds] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [newMenu, setNewMenu] = useState({ name: "", description: "" });
  const message = useMessage();
  const [loading, setLoading] = useState(false);
  const { getProducts } = useProduct();
  const router = useRouter();

  useEffect(() => {
    if (isUpdate !== false) {
      setIsModalOpen(true);
      const data = menus.find((menu) => menu._id === isUpdate);
      setNewMenu(data);
    }
  }, [isUpdate]);

  const menOnboardingController = async () => {
    const response = await getProducts();
    if (STORAGE.getLocal("isCompleteMenuBoard") == "false" && response.length) {
      setIsModalOpen(true);
    }
    if (STORAGE.getLocal("isCompleteMenuBoard") == "false" && !response.length) {
      router.push("/product");
    }
  };

  useEffect(() => {
    menOnboardingController();
  }, [router.isReady]);

  const getCompanyMenus = async () => {
    setLoading(true);
    const response = await MENU_SERVICE.get();
    const meResponse = await USER_SERVICE.me();
    setActiveMenuId(meResponse.data.data.company.activeMenu);
    setLoading(false);
    setMenus(response.data);
  };

  const deleteMenu = async ({ menuId, menuIds }) => {
    console.log("menuId :>> ", menuId);
    console.log("menuIds :>> ", menuIds);
    await MENU_SERVICE.deleteMenu({ menuId, menuIds });
    getCompanyMenus();
  };

  const updateClickHandler = async () => {
    const response = await MENU_SERVICE.update(isUpdate, { name: newMenu.name, description: newMenu.description });
    const filteredMenu = menus.filter((menu) => menu._id !== isUpdate);
    filteredMenu.push(response.data);
    setMenus(filteredMenu);
    getCompanyMenus();
    setIsUpdate(false);
    setIsModalOpen(false);
  };

  const rowclickHandler = (menu) => {
    router.push(`/menu/${menu._id}`);
  };

  const createMenu = async () => {
    setLoading(true);
    const { name, desc } = newMenu;
    if (!name.length) {
      message.error("İsim girmelisiniz");
      return;
    }
    const response = await MENU_SERVICE.create(name, desc);
    setLoading(false);
    if (response.status !== 200) {
      message.error("Menü oluşturulamadı");
      return;
    }
    setMenus([...menus, response.data]);
    setIsModalOpen(false);
    if (STORAGE.getLocal("isCompleteMenuBoard") == "false") {
      const { data } = response;
      router.push(`/menu/${data._id}`);
    }
  };

  const activeMenuChangeHandler = async (menuId) => {
    const response = await COMPANY_SERVICE.update({ activeMenu: menuId });
    setActiveMenuId(menuId);
    return response.data;
  };

  const menuSelectHandler = (checked, menuId) => {
    if (checked) {
      setSelectedMenuIds([...selectedMenuIds, menuId]);
      return;
    }
    setSelectedMenuIds(selectedMenuIds.filter((ids) => ids !== menuId));
  };

  console.log("selectedMenuIds :>> ", selectedMenuIds);
  useEffect(() => {
    getCompanyMenus();
  }, []);

  return (
    <div>
      {contextHolder}
      <div className="title">Menus</div>
      <button onClick={() => setSelectModeActive(!selectModeActive)}>Seç</button>
      {selectModeActive && <button onClick={() => deleteMenu({ menuIds: selectedMenuIds })}>Seçili Menüleri Sil</button>}
      <div>
        <Table
          loading={loading}
          rowKey="_id"
          dataSource={menus}
        >
          {selectModeActive && (
          <Table.Column
            width={20}
            align="center"
            render={(_, record) => (
              <Space>
                <Checkbox onChange={(e) => menuSelectHandler(e.target.checked, record._id)} value={selectedMenuIds.includes(record._id)} />
              </Space>
            )}
          />
          )}
          <Table.Column
            width={20}
            align="center"
            render={(_, record) => (
              <Space>
                <Checkbox type="radio" onChange={() => activeMenuChangeHandler(record._id)} value={record._id === activeMenuId} />
              </Space>
            )}
          />
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
                <div onClick={() => deleteMenu({ menuId: record._id })}>delete</div>
                <div onClick={() => setIsUpdate(record._id)}>update</div>
              </Space>
            )}
          />

        </Table>
      </div>
      <div className="create-menu">
        <Button variant="outlined" onClick={() => setIsModalOpen(true)}>Create Menu</Button>
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
