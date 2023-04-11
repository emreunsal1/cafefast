import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { MENU_SERVICE } from "../../services/menu";
import CategorySideBar from "@/components/CategorySideBar";
import { useMenu } from "../../context/MenuContext";

export default function MenuDetail() {
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [products, setProducts] = useState([]);

  const { getMenu } = useMenu();

  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      getMenu(router.query.menuId);
    }
  }, [router.isReady]);

  return (
    <div>
      <div className="side-bar">
        <CategorySideBar />
      </div>
    </div>
  );
}
