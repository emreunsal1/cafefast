import React, { useEffect } from "react";
import MenuBar from "../components/MenuBar";
import USER_SERVICE from "../services/user";
import Layout from "@/components/Layout";

export default function Index() {
  useEffect(() => {
    USER_SERVICE.me();
  }, []);

  return (
    <div>
      <div className="menu">
        <MenuBar />
      </div>
      burası main page register veya login olduk yupiii!!
    </div>
  );
}

Index.getLayout = function getLayout(index) {
  return (
    <Layout>
      {index}
    </Layout>
  );
};
