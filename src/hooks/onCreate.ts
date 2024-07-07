import type { Model } from "../models";
import all from "./all";

export default function (model: Model) {
  for (let i = 0; i < model.schemas.length; i++) {
    let onCreate = model.schemas[i].onCreate;

    if (onCreate) {
      if (typeof onCreate === "string") {
        // @ts-ignore
        onCreate = all[onCreate];
      }

      if (!onCreate || typeof onCreate === "string") {
        throw "function not found for " + onCreate;
      }

      model = onCreate?.fn(model.schemas[i].key, model, onCreate.args);
    }
  }

  return model;
}
