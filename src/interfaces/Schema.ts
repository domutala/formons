/** Schema is ... */

import { Model } from "./Model";

export interface Schema {
  key: string;

  default?: any;

  events: SchemaEvents;
  interface: SchemaInterface;

  /**
   * validation functions are called before submitting form and after `Schema.onBeforeSubmit`.
   * They can also be called directly with the `Model.validate` function.
   *
   * The aim is to fill in `Model.isFormValid` and update `Schema.errors`.
   *
   * Validator priority based on schema order and order of arrival in `Schema.validators`.
   * */
  validators: Array<SchemaValidator>;

  errors: string[];
}

export interface SchemaInterface {
  /** formons-shema="key" */
  el?: Element;
  [key: string]: any;
}

export interface SchemaEvents {
  /** After creating the model */
  onModelCreated?: (key: string, model: Model) => Model | Promise<Model>;

  /** This function is called after the `Model.mount` function has been called. */
  onMounted?: (key: string, model: Model) => Model | Promise<Model>;

  /** this function is called before the form is submitted */
  onBeforeSubmit?: (key: string, model: Model) => Model | Promise<Model>;

  /** custom event like `onSave` for example  */
  [funcName: string]:
    | ((key: string, model: Model) => Model | Promise<Model>)
    | undefined;
}

export type SchemaValidator = {
  fn: (model: Model, ...args: any) => Model | Promise<Model>;
  args?: any;
};

// export type SchemaOptions = Partial<Schema> & Pick<Schema, "key">;
export interface SchemaOptions {
  key: string;
  events?: SchemaEvents;
  interface?: SchemaInterface;
  validators?: Array<SchemaValidator>;
}
