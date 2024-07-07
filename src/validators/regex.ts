import type { Validator } from "../models";

const fn: Validator = (schemaKey, model, args = {}) => {
  const index = model.schemasIndex[schemaKey];
  model.schemas[index]._errors ||= [];

  if (args.array) {
    if (typeof model.formValues[schemaKey] !== "undefined") {
      if (!Array.isArray(model.formValues[schemaKey])) {
        model.schemas[index]._errors!.push(
          `${schemaKey}_must_be_array_of_uuid`
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
    const message = args.message || "regex_not_match";
    if (!args.regex.test(value)) model.schemas[index]._errors!.push(message);
  }

  return model;
};

export default fn;
