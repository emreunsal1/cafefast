import React from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";

export const getLayout = () => function _getLayout(index) {
  const router = useRouter();

  if (router.pathname.includes("auth")) {
    return index;
  }

  return (
    <Layout>
      {index}
    </Layout>
  );
};
