import { CDN_URL } from "@/constants";
import instance from "../utils/axios";

const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  return instance.post(CDN_URL, formData, {
    headers: {
      "content-type": "multipart/form-data",
    },
  });
};

export const CDN_SERVICE = {
  uploadImage,
};
