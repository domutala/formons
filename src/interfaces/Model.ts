import { Schema } from "./Schema";

export interface Model {
  name?: string;

  schemas: Schema[];

  formValues: { [schemaKey: string]: any };

  el?: HTMLFormElement;

  isFormValid: boolean;

  schemasIndex: { [schemaKey: string]: number };

  mount(el?: HTMLFormElement): Promise<Model>;

  submit(): void;

  validate(): Promise<boolean>;
}
