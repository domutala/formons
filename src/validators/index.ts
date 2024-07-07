import type { Hook, Model } from "../models";

import required from "./required";
import _number from "./number";
import _string from "./string";
import _boolean from "./boolean";
import uuid from "./uuid";
import regex from "./regex";

export function build(model: Model) {
  model.validators = {
    required,
    number: _number,
    string: _string,
    boolean: _boolean,
    uuid,
    regex,
  };

  model.validate = async function () {
    for (let i = 0; i < this.schemas.length; i++) {
      const schema = this.schemas[i];
      this.schemas[i]._errors = [];

      for (const key of Object.keys(schema._validators)) {
        const _validator = schema._validators[key];
        let validator: Hook;
        let name: string;
        let args: any;

        if (typeof _validator === "function") {
          name = _validator.name;
          validator = _validator;
        } else if (typeof _validator !== "object") {
          name = key;
          validator = this.validators[key];
        } else {
          args = _validator.args;
          if (typeof _validator.fn === "string") {
            name = _validator.fn;
            validator = this.validators[_validator.fn];
          } else {
            validator = _validator.fn;
            name = validator?.name;
          }
        }

        if (!validator) throw `validator ${name} is not defined`;
        await validator(schema.key, this, args);
      }
    }

    this.isValid = !this.schemas.some(
      (item) => item._errors && item._errors.length > 0
    );

    return this;
  };

  model.addValidator = function (key: string, fn: Hook) {
    this.validators[key] = fn;
    return this;
  };

  return model;
}
