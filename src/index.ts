import type { Model, Plugin, Schema } from "./models";
import onCreate from "./hooks/onCreate";
import defu from "defu";
import { build } from "./validators";
import _plugins from "./plugins";

export function create({
  schemas,
  base,
  watch,
}: {
  schemas?: Partial<Schema>[];

  base?: { [schemaKey: string]: any };

  /** cette fonction est appelée à chaque fois que la valeur de la formulaire change */
  watch?: (model: Model) => Model;
}) {
  const _schemas = defu({ schemas: [] }, { schemas }).schemas as Schema[];
  let formValues = (base ||= {});

  for (let i = 0; i < _schemas.length; i++) {
    _schemas[i]._validators ||= {};
    _schemas[i]._conditions ||= [];
    _schemas[i]._interface ||= {};

    if (
      typeof _schemas[i].default !== "undefined" &&
      typeof formValues[_schemas[i].key] === "undefined"
    ) {
      formValues[_schemas[i].key] = _schemas[i].default;
    }
  }

  const proxyHandler = {
    set(obj: any, prop: string, value: any) {
      if (
        Object.prototype.toString.call(value) === "[object Object]" ||
        Array.isArray(value)
      ) {
        obj[prop] = new Proxy(value, proxyHandler);
      } else obj[prop] = value;

      if (watch) _model = watch(_model);

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

  /** @ts-ignore */
  let _model: Model = {
    schemas: _schemas,
    formValues: defu({}, formValues),
  };

  _model = build(_model);
  if (!base) _model = onCreate(_model);
  else console.log("update");

  function schemaIndexGetter() {
    const schemasIndex = _model.schemas.reduce((obj, schema, index) => {
      obj[schema.key] = index;
      return obj;
    }, {} as { [x: string]: number });

    return schemasIndex;
  }
  function schemaIndexSetter() {
    return true;
  }
  Object.defineProperty(_model, "schemasIndex", {
    get: schemaIndexGetter,
    set: schemaIndexSetter,
    enumerable: true,
    configurable: true,
  });

  for (const plugin of plugins) {
    _model = plugin.fn(_model, plugin.args);
  }

  _model.formValues = buildProxy(_model.formValues);

  return _model;
}

export function use(
  fn: (model: Model, args?: { [key: string]: any }) => Model,
  args?: { [key: string]: any }
) {
  plugins.push({ fn, args });
}

const plugins: Plugin[] = [..._plugins];
