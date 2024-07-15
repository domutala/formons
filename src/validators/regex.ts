import { Model } from "../interfaces/Model";

const fn = (
  model: Model,
  schemaKey: string,
  regex: RegExp,
  options: { array?: boolean; message?: string } = {}
) => {
  const index = model.schemasIndex[schemaKey];
  model.schemas[index].errors ||= [];

  if (options.array) {
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
    const message = options.message || "regex_not_match";
    if (!regex.test(value)) model.schemas[index].errors!.push(message);
  }

  return model;
};

export default fn;
