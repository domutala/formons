import { Model } from "../interfaces/Model";

const required = (model: Model, schemaKey: string) => {
  const index = model.schemas.findIndex((schema) => schema.key === schemaKey);
  if (index === -1) throw "schema not found";

  model.schemas[index].errors ||= [];

  // aller dans le formulaire, recueillir la valeur est vérifier s'il existe ou pas
  if (typeof model.formValues[schemaKey] === "undefined") {
    model.schemas[index].errors.push("required value");
    // throw "required value";
  } else if (!`${model.formValues[schemaKey]}`.length) {
    model.schemas[index].errors.push("required value");
  }

  return model;
};

export default required;
