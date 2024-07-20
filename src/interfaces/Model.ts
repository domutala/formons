import { Schema } from "./Schema";

export interface Model {
  name?: string;

  schemas: Schema[];

  formValues: { [schemaKey: string]: any };

  el?: HTMLFormElement;

  isFormValid: boolean;

  schemasIndex: { [schemaKey: string]: number };

  metas: { [key: string]: any };

  mount(el?: HTMLFormElement): Promise<Model>;

  submit(): void;

  validate(): Promise<boolean>;
}
