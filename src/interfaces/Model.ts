import { Schema } from "./Schema";

export interface Model {
  schemas: Schema[];

  formValues: { [schemaKey: string]: any };

  el?: HTMLFormElement;

  // readonly schemasIndex: { [schemaKey: string]: number };

  // formValues: { [schemaKey: string]: any };

  mount(): Promise<Model>;

  submit(): void;
}
