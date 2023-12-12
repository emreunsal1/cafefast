export const API_URl = "http://localhost:4000";
export const THREED_START_PAGE = "/payment/3d-start";
export const PRODUCT_ROUTE = "/product";
export const AUTH_TOKEN_NAME = "auth_token";
export const COMPANY_ROUTE = "/company";
export const ADRESS_ROUTE = "/location";
export const MENU_ROUTE = "/menu";
export const CAMPAING_ROUTE = "/campaigns";
export const AUTH_PAGE_URL = "/auth";
export const USER_PATH = "/user";
export const CDN_URL = "/image";

// LOCAL STORAGE KEYS

export const LOCAL_COMPANY_ID_KEY = "companyID";
export const ORDER_STATUSES = [
  "waiting_approve",
  "in_progress",
  "ready",
  "delivered",
  "canceled",
];
export const ORDER_STATUS_TEXTS = {
  waiting_approve: "Onay Bekliyor",
  in_progress: "Hazırlanıyor",
  ready: "Hazır",
  delivered: "Teslim Edildi",
  canceled: "İptal Edildi",
};

export const PAGE_TITLES = {
  product: "Yönetim Paneli | Ürünler",
  menu: "Yönetim Paneli | Menüler",
  kitchen: "Yönetim Paneli | Mutfak",
  table: "Yönetim Paneli | Masalar",
  campaings: "Yönetim Paneli | Kampanyalar",
  profile: "Yönetim Paneli | Profil Bilgileri",
};

export const CLIENT_SIDE_IS_LOGIN_COOKIE_NAME = "is-login";
export const AWS_CLOUDFRONT_URL = "https://d1w5rwlodabrlm.cloudfront.net";

export const SAFE_IMAGE_TYPE = "image/png,image/jpeg, image/webp, image/heic";
