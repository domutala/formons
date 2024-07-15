import { Model } from "./interfaces/Model";
import { SchemaOptions, Schema } from "./interfaces/Schema";

export async function create({
  schemaOptions = [],
  el,
  base = {},
  onSubmit,
  onFormValuesChanged,
}: {
  schemaOptions?: SchemaOptions[];
  /** l'élement qui contient le formulaire */
  el?: HTMLFormElement;

  base?: { [schemaKey: string]: any };

  onSubmit?(model: Model): void;

  onFormValuesChanged?(model: Model): void;
} = {}) {
  const schemas: Schema[] = [];
  for (let i = 0; i < schemaOptions.length; i++) {
    const schemaOption = schemaOptions[i];

    const schema: Schema = {
      key: schemaOption.key,
      _events: schemaOption.events || {},
      _interface: schemaOption.interface || {},
    };

    schemas.push(schema);
  }

  let model: Model = {
    schemas: schemas,
    formValues: base,
    el,

    async mount() {
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

          if (schema._events.onMounted) {
            _this = await schema._events.onMounted(schema.key, model);
          }

          schemas[i] = schema;
        }
      }

      await runOnMountedFunctions();

      if (window && _this.el) _this.el.addEventListener("submit", submit);

      return _this;
    },

    submit() {
      if (this.el) this.el!.submit();
    },
  };

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

  async function submit(e: Event) {
    e.preventDefault();

    if (model.el) {
      async function runOnBeforeSubmitFunctions() {
        for (let i = 0; i < schemas.length; i++) {
          const schema = schemas[i];
          if (schema._events.onBeforeSubmit) {
            model = await schema._events.onBeforeSubmit(schema.key, model);
          }
        }
      }

      await runOnBeforeSubmitFunctions();

      if (onSubmit) onSubmit(model);
    }
  }

  /**
   * Run onModelCreate functions
   */
  async function runOnModelCreateFunctions() {
    for (let i = 0; i < schemas.length; i++) {
      const schema = schemas[i];
      if (schema._events.onModelCreated) {
        model = await schema._events.onModelCreated(schema.key, model);
      }
    }
  }

  await runOnModelCreateFunctions();

  return model;
}
