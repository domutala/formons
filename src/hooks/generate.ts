import type { HookObject } from "../models";

const generate: HookObject = {
  name: "generate",
  fn: (schemaKey, model) => {
    const index = model.schemas.findIndex((schema) => schema.key === schemaKey);
    if (index === -1) throw "schema not found";

    return model;
  },
};

export default generate;
