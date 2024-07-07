export const typeAvailabl = ["string", "boolean", "number", "uuid"] as const;
export const typeAvailables = ["string", "boolean", "number", "uuid"] as const;
export type Type = (typeof typeAvailables)[number];

export interface Schema {
  key: string;
  // type: string;
  default?: any;

  onCreate?: HookObject;
  onUpdate?: HookObject;

  /**
   * ce sont des fonctions qui vont valider les valeurs du formulaire
   * pour utiliser un fonction prédéfini comme `required` par exemple,
   * il faut mettre le nom de la fonction à true
   * */
  _validators: {
    /** spécial validator qui vérifie si la valeur est requise */
    required?: ValidatorObject;

    /** spécial validators qui vérifient la longueur de la valeur */
    length?: ValidatorObject;
    maxLength?: ValidatorObject;
    minLength?: ValidatorObject;

    [validatorName: string]: ValidatorObject | undefined;
  };

  _interface: {
    hidden?: boolean;
    type?: string;
    [key: string]: any;
  };

  _conditions: Array<(model: Model) => Model>;

  _errors?: string[];
}

export interface Model {
  schemas: Schema[];

  formValues: { [schemaKey: string]: any };

  readonly schemasIndex: { [schemaKey: string]: number };

  validators: { [key: string]: Hook };
  addValidator(key: string, fn: Hook): Model;
  validate: () => Promise<Model>;
  isValid: boolean;
}

/** Fonction de validation d'un schema. */
export type Validator = Hook;

// export type Hook = (schemaKey: string, model: Model, ...args: any[]) => Model;
export type Hook = (
  schemaKey: string,
  model: Model,
  args?: { [key: string]: any }
) => Model;

// | ("generateUUID" | "generate" | string)
export type HookObject = string | { name: string; args?: any; fn: Hook };

export type ValidatorObject =
  | string
  | boolean
  | number
  | { args?: { [key: string]: any }; fn: Hook | string }
  | Hook;

export type Plugin = {
  fn: (model: Model, args?: { [key: string]: any }) => Model;
  args?: { [key: string]: any };
};
