import type { Validator } from "../models";

// exemple de validator
const required: Validator = (schemaKey, model) => {
  const index = model.schemas.findIndex((schema) => schema.key === schemaKey);
  if (index === -1) throw "schema not found";

  if (model.schemas[index]._validators.required) {
    model.schemas[index]._errors ||= [];

    // aller dans le formulaire, recueillir la valeur est vérifier s'il existe ou pas
    if (typeof model.formValues[schemaKey] === "undefined") {
      model.schemas[index]._errors.push("required value");
      // throw "required value";
    } else if (!`${model.formValues[schemaKey]}`.length) {
      model.schemas[index]._errors.push("required value");
    }
  }

  return model;
};

export default required;
