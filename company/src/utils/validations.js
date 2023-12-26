/* eslint-disable prefer-destructuring */
import * as Yup from "yup";
import z from "zod";

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const registerValidationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string().required("Required"),
  passwordConfirmation: Yup.string().oneOf(
    [Yup.ref("password"), ""],
    "Passwords must match",
  ),
  phone: Yup.string().matches(phoneRegExp, "Phone number is not valid"),
});

export const productSaveValidator = z.object({
  name: z.string().min(1, "Minimum 1 karakter girilmelidir"),
  description: z.string(),
  price: z.number().min(1, "Fiyat bilgisine en az 1 girebilirsiniz"),
});

export const productAttributeValidator = z.object({
  title: z.string().min(1, "Minimum 1 karakter girilmelidir").max(255),
  description: z.string().min(1, "Minimum 1 karakter girilmelidir").max(255),
  options: z.array(z.object({
    name: z.string().min(1, "Seçenek ismi en az 1 (bir) karakter olmalı").max(255),
    price: z.number(),
  })),
});

export const mapZodErrorObject = (zodError) => {
  const flattenErrors = zodError.flatten().fieldErrors;

  const mappedErrors = {};
  Object.keys(flattenErrors).forEach((fieldKey) => {
    mappedErrors[fieldKey] = flattenErrors[fieldKey][0];
  });

  return mappedErrors;
};
