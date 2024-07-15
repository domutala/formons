/** Schema is ... */

import { Model } from "./Model";

export interface Schema {
  key: string;

  default?: any;

  events: SchemaEvents;
  _interface: SchemaInterface;

  /**
   * validation functions are called before and after `Schema.onBeforeSubmit` the submit.
   * They can also be called directly with the `Model.validate` function.
   * The aim is to fill in `Model.isFormValid` and update `Schema._errors`.
   * */
  _validators: Array<SchemaValidator>;

  errors: string[];
}

export interface SchemaInterface {
  /** formons-shema="key" */
  el?: Element;
  metas?: { [key: string]: any };
}

export interface SchemaEvents {
  /** au moment de création du model */
  onModelCreated?: (key: string, model: Model) => Model | Promise<Model>;

  /**
   * This function is called when the element managing
   * this schema is mounted in the dom
   * */
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
