import { THREED_START_PAGE } from "../constants";

export const redirectToPayment = (response: { html: string }) => {
  const newForm = document.createElement("form");
  newForm.style.display = "none";
  newForm.style.visibility = "hidden";
  newForm.method = "POST";
  newForm.action = THREED_START_PAGE;
  const newInput = document.createElement("input");
  newInput.name = "html";
  newInput.value = response.html;
  newForm.appendChild(newInput);
  document.body.appendChild(newForm);
  newForm.submit();
};
