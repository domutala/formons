/** Schema is ... */

import { Model } from "./Model";

export interface Schema {
  key: string;

  default?: any;

  _events: SchemaEvents;
  _interface: SchemaInterface;
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

// export type SchemaOptions = Partial<Schema> & Pick<Schema, "key">;
export interface SchemaOptions {
  key: string;
  events?: SchemaEvents;
  interface?: SchemaInterface;
}
