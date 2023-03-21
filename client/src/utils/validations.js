import * as Yup from "yup";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const registerValidationSchema = () =>
  Yup.object().shape({
    email: Yup.string().email("Invalid email address").required("Required"),
    name: Yup.string().required("Required"),
    surname: Yup.string().required("Required"),
    password: Yup.string().required("Required"),
    passwordConfirmation: Yup.string().oneOf(
      [Yup.ref("password"), ""],
      "Passwords must match"
    ),
    company: Yup.string().required("Required"),
    phone: Yup.string().matches(phoneRegExp, "Phone number is not valid"),
  });
