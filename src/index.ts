import { Model } from "./interfaces/Model";
import { SchemaOptions, Schema } from "./interfaces/Schema";

export { default as validators } from "./validators";

export interface Options {
  schemaOptions?: SchemaOptions[];
  /** l'élement qui contient le formulaire */
  //

  base?: { [schemaKey: string]: any };

  onSubmit?(model: Model): void;

  onFormValuesChanged?(model: Model): void;
}

export async function create({
  schemaOptions = [],
  base = {},
  onSubmit,
  onFormValuesChanged,
}: Options = {}) {
  const schemas: Schema[] = [];
  for (let i = 0; i < schemaOptions.length; i++) {
    const schemaOption = schemaOptions[i];

    const schema: Schema = {
      key: schemaOption.key,
      events: schemaOption.events || {},
      _interface: schemaOption.interface || {},
      _validators: schemaOption.validators || [],
      errors: [],
    };

    schemas.push(schema);
  }

  let model: Model = {
    schemas: schemas,
    formValues: base,
    isFormValid: true,

    schemasIndex: {},

    async mount(form?: HTMLFormElement) {
      this.el = form;
      let _this = this;

      for (let i = 0; i < _this.schemas.length; i++) {
        const schema = _this.schemas[i];

        if (
          typeof schema.default !== "undefined" &&
          typeof _this.formValues[schema.key] === "undefined"
        ) {
          this.formValues[schema.key] = schema.default;
        }
      }

      async function runOnMountedFunctions() {
        for (let i = 0; i < schemas.length; i++) {
          const schema = schemas[i];

          if (window) {
            const el = document.querySelector(
              `[formons-shema="${schema.key}"]`
            );

            if (el) schema._interface.el = el;
          }

          if (schema.events.onMounted) {
            _this = await schema.events.onMounted(schema.key, model);
          }

          schemas[i] = schema;
        }
      }

      await runOnMountedFunctions();

      if (window && _this.el) _this.el.addEventListener("submit", submit);

      return _this;
    },

    submit() {
      this.el?.submit();
    },

    async validate() {
      await runValidators();
      return this.isFormValid;
    },
  };

  function setSchemasIndex() {
    function schemaIndexGetter() {
      const schemasIndex = model.schemas.reduce((obj, schema, index) => {
        obj[schema.key] = index;
        return obj;
      }, {} as { [x: string]: number });

      return schemasIndex;
    }
    function schemaIndexSetter() {
      return true;
    }
    Object.defineProperty(model, "schemasIndex", {
      get: schemaIndexGetter,
      set: schemaIndexSetter,
      enumerable: true,
      configurable: true,
    });
  }
  setSchemasIndex();

  function setIsFormValid() {
    function getter() {
      const isValid = !model.schemas.some(
        (item) => item.errors && item.errors.length > 0
      );

      return isValid;
    }
    function setter() {
      return true;
    }
    Object.defineProperty(model, "isFormValid", {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    });
  }
  setIsFormValid();

  function createProxy() {
    const proxyHandler = {
      set(obj: any, prop: string, value: any) {
        if (
          Object.prototype.toString.call(value) === "[object Object]" ||
          Array.isArray(value)
        ) {
          obj[prop] = new Proxy(value, proxyHandler);
        } else obj[prop] = value;

        if (onFormValuesChanged) onFormValuesChanged(model);

        return true;
      },
    };

    function buildProxy(obj: Array<any> | Object) {
      const proxy = new Proxy(obj, proxyHandler);
      for (const key in proxy) {
        if (Object.prototype.hasOwnProperty.call(proxy, key)) {
          if (
            Object.prototype.toString.call(proxy[key]) === "[object Object]" ||
            Array.isArray(proxy[key])
          ) {
            proxy[key] = new Proxy(proxy[key], proxyHandler);
          }
        }
      }

      return proxy;
    }

    model.formValues = buildProxy(model.formValues);
  }
  createProxy();

  async function runValidators() {
    for (let i = 0; i < schemas.length; i++) {
      const schema = schemas[i];

      for (let v = 0; v < schema._validators.length; v++) {
        const validator = schema._validators[v];
        model = await validator.fn(model, ...(validator.args || []));
      }
    }
  }

  async function submit(e: Event) {
    e.preventDefault();

    if (model.el) {
      async function runOnBeforeSubmitFunctions() {
        for (let i = 0; i < schemas.length; i++) {
          const schema = schemas[i];
          if (schema.events.onBeforeSubmit) {
            model = await schema.events.onBeforeSubmit(schema.key, model);
          }
        }
      }

      await runOnBeforeSubmitFunctions();
      await runValidators();

      if (onSubmit) onSubmit(model);
    }
  }

  /**
   * Run onModelCreate functions
   */
  async function runOnModelCreateFunctions() {
    for (let i = 0; i < model.schemas.length; i++) {
      model.schemas[i].errors = [];
      if (model.schemas[i].events.onModelCreated) {
        model = await model.schemas[i].events.onModelCreated!(
          model.schemas[i].key,
          model
        );
      }
    }
  }

  await runOnModelCreateFunctions();

  return model;
}
