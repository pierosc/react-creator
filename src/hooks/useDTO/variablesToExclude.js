import {
  createVarsToExclude,
  updateVarsToExclude,
} from "../../constants/varsToExclude";

export const excludeVars = (attrs) => {
  let finalAttributes = [];
  attrs.forEach((attr) => {
    if (
      !createVarsToExclude.includes(attr.name.toUpperCase()) &&
      !updateVarsToExclude.includes(attr.name.toUpperCase())
    ) {
      finalAttributes = [...finalAttributes, attr];
    }
  });
  return finalAttributes;
};
