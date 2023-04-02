import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { MENU_SERVICE } from "../../services/menu";

export default function MenuDetail() {
  const [menu, setMenu] = useState({});

  const router = useRouter();

  useEffect(() => {
    console.log(router.query);
  // MENU_SERVICE.detail(route)
  }, []);

  return (
    <div>Menu Detail</div>
  );
}
