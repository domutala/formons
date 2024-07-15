import { Schema } from "./Schema";

export interface Model {
  schemas: Schema[];

  formValues: { [schemaKey: string]: any };

  el?: HTMLFormElement;

  isFormValid: boolean;

  schemasIndex: { [schemaKey: string]: number };

  mount(): Promise<Model>;

  submit(): void;

  validate(): Promise<boolean>;
}
