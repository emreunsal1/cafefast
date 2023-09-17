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

const uploadMultipleImages = async (files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("images", file);
  });
  return instance.post(`${CDN_URL}/multi`, formData, {
    headers: {
      "content-type": "multipart/form-data",
    },
  });
};

export const CDN_SERVICE = {
  uploadImage,
  uploadMultipleImages,
};
