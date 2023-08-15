import { SortOrder } from "mongoose";

export enum ORDER_BY {
  ASC = "asc",
  DESC = "desc"
}

export const ORDERBY_AS_MONGOOSE_SORT: {[key: string]: SortOrder} = {
  [ORDER_BY.ASC]: 1,
  [ORDER_BY.DESC]: -1,
};
