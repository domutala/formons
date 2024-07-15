import { Model } from "../interfaces/Model";

const fn = (model: Model, schemaKey: string, array = false) => {
  const index = model.schemasIndex[schemaKey];
  model.schemas[index].errors ||= [];

  if (array) {
    if (typeof model.formValues[schemaKey] !== "undefined") {
      if (!Array.isArray(model.formValues[schemaKey])) {
        model.schemas[index].errors!.push(`${schemaKey}_must_be_array_of_uuid`);
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
    let message = `${schemaKey}_must_be_uuid`;
    if (array) message = `${schemaKey}_must_be_array_of_uuid`;

    const regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!regex.test(value)) model.schemas[index].errors!.push(message);
  }

  return model;
};

export default fn;
