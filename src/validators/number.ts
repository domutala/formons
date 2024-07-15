import { Model } from "../interfaces/Model";

const fn = (model: Model, schemaKey: string, array = false) => {
  const index = model.schemasIndex[schemaKey];
  model.schemas[index].errors ||= [];

  if (array) {
    if (typeof model.formValues[schemaKey] !== "undefined") {
      if (!Array.isArray(model.formValues[schemaKey])) {
        model.schemas[index].errors!.push(
          `${schemaKey}_must_be_array_of_number`
        );
      } else {
        for (let i = 0; i < model.formValues[schemaKey].length; i++) {
          const value = model.formValues[schemaKey][i];
          verify(value);
        }
      }
    }
  } else {
    if (typeof model.formValues[schemaKey] !== "undefined") {
      verify(model.formValues[schemaKey]);
    }
  }

  function verify(value: any) {
    let message = `${schemaKey}_must_be_number`;
    if (array) message = `${schemaKey}_must_be_array_of_number`;
    if (typeof value !== "number") model.schemas[index].errors!.push(message);
  }

  return model;
};

export default fn;
