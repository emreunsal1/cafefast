import React, { useEffect, useRef, useState } from "react";
import {
  Table, Space,
  Modal, Input,
} from "antd";
import { useRouter } from "next/router";
import COMPANY_SERVICE from "@/services/company";
import { STORAGE } from "@/utils/browserStorage";
import { useProduct } from "@/context/ProductContext";
import USER_SERVICE from "@/services/user";
import Button from "@/components/library/Button";
import Checkbox from "@/components/library/Checkbox";
import { useMessage } from "@/context/GlobalMessage";
import Icon from "@/components/library/Icon";
import { useLoading } from "@/context/LoadingContext";
import { MENU_SERVICE } from "../../services/menu";

export default function Menu() {
  const [menus, setMenus] = useState([]);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenuIds, setSelectedMenuIds] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [newMenu, setNewMenu] = useState({ name: "", description: "" });
  const message = useMessage();
  const { loading, setLoading } = useLoading();
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
    if (!STORAGE.getLocal("isCompleteMenuBoard") && response.length) {
      setIsModalOpen(true);
    }
    if (!STORAGE.getLocal("isCompleteMenuBoard") && !response.length) {
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
    setLoading(true);
    setSelectedMenuIds([]);
    await MENU_SERVICE.deleteMenu({ menuId, menuIds });
    getCompanyMenus();
    setLoading(false);
  };

  const deleteSelectedMenus = async () => {
    setLoading(true);
    const selectedMenus = selectedMenuIds;
    setSelectedMenuIds([]);

    await MENU_SERVICE.deleteMenu({ menuIds: selectedMenus });
    await getCompanyMenus();
    setLoading(false);
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

  const redirectToMenu = (menu) => {
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
    if (response.status !== 200) {
      message.error("Menü oluşturulamadı");
      setLoading(false);
      return;
    }
    message.success("Menü oluşturuldu");
    setMenus([...menus, response.data]);
    setIsModalOpen(false);
    if (STORAGE.getLocal("isCompleteMenuBoard")) {
      const { data } = response;
      router.push(`/menu/${data._id}`);
    }
    setLoading(false);
  };

  const changeActiveMenu = async (menuId) => {
    const response = await COMPANY_SERVICE.update({ activeMenu: menuId });
    message.success("Aktif menü değiştirildi");
    setActiveMenuId(menuId);
    return response.data;
  };

  useEffect(() => {
    getCompanyMenus();
  }, []);

  return (
    <div className="menus-page">
      <div className="menus-page-header">
        <h3>Menüler</h3>
        <Button variant="outlined" onClick={() => setIsModalOpen(true)}>
          Yeni Menü Oluştur
          <Icon name="plus" />
        </Button>
      </div>
      <div className="menus-page-actions">
        <Button onClick={deleteSelectedMenus} disabled={selectedMenuIds.length === 0}>Seçili Menüleri Sil</Button>
      </div>
      <div>
        <Table
          rowSelection={{
            type: "checkbox",
            onChange: (selectedRowKeys) => {
              setSelectedMenuIds(selectedRowKeys);
            },
          }}
          loading={loading}
          rowKey="_id"
          dataSource={menus}
        >

          <Table.Column
            width={120}
            align="center"
            render={(_, record) => {
              if (record._id === activeMenuId) {
                return <Button disabled key="activeMenuDisabledButton" fluid>Aktif</Button>;
              }
              return (
                <Button
                  fluid
                  key="activeMenuActiveButton"
                  confirmOptions={{
                    confirmText: "Sitenizde gözüken menünüz artık bu menü olacak onaylıyor musunuz?",
                    onOkClick: () => changeActiveMenu(record._id),
                  }}
                >
                  Aktif Et
                </Button>
              );
            }}
          />
          <Table.Column
            title="Menü Adı"
            key="name"
            render={(_, record) => (
              <Space>
                <div>{record.name}</div>
              </Space>
            )}
          />
          <Table.Column
            title="Açıklama"
            key="description"
            render={(_, record) => (
              <Space>
                <div>{record.description}</div>
              </Space>
            )}
          />
          <Table.Column
            title=""
            key="action"
            width={100}
            render={(_, record) => (
              <div className="menus-page-table-actions">
                <Button variant="outlined" onClick={() => redirectToMenu(record)}>
                  Detay
                  <Icon name="menu" />
                </Button>
                <Button onClick={() => { setIsUpdate(record._id); setIsModalOpen(true); }}>
                  Düzenle
                  <Icon name="edit-outlined" />
                </Button>
                <Button
                  variant="red"
                  confirmOptions={{
                    confirmText: "Sitenizde gözüken menünüz artık bu menü olacak onaylıyor musunuz?",
                    onOkClick: () => deleteMenu({ menuId: record._id }),
                    okText: "Sil",
                  }}
                >
                  Sil
                </Button>
              </div>
            )}
          />

        </Table>
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
