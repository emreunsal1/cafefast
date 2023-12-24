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
  description: z.string().min(5, "Minimum 5 karakter girilmelidir"),
  price: z.number().min(1, "Fiyat bilgisine en az 1 girebilirsiniz"),
});

export const mapZodErrorObject = (zodError) => {
  const flattenErrors = zodError.flatten().fieldErrors;

  const mappedErrors = {};
  Object.keys(flattenErrors).forEach((fieldKey) => {
    mappedErrors[fieldKey] = flattenErrors[fieldKey][0];
  });

  return mappedErrors;
};
