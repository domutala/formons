# formons

## What is Formons? 📝

Formons is a powerful tool designed to simplify the creation of interactive forms in development. Whether you're using React, Vue.js, Angular, or any other JavaScript framework, Formons offers a flexible, framework-agnostic solution for managing forms.

## Key Features 🛠️

- **Building complex forms**: With Formons, you can easily create forms containing various types of fields such as text, numeric, select, checkboxes, etc. Its flexibility allows effortless management of complex form structures.

- **Framework independence**: Unlike other solutions that may be specific to a particular framework, Formons is designed to be used with any JavaScript framework. This means you can easily integrate it into your existing project, regardless of the front-end technology you are using.

In summary, Formons provides a robust and versatile solution to simplify the creation and management of forms in your web projects, irrespective of the framework you are using.

## install

```bash
# yarn
yarn add formons

# npm
npm install formons
```

## usage

```html
<form id="form">
  <input type="text" formons-shema="name" placeholder="name" />
  <input type="number" formons-shema="age" placeholder="age" />
  <button type="submit">Click me</button>
</form>
```

```ts
import { create, validators } from "formons";

const model = create({
  schemaOptions: [
    {
      key: "name",

      validators: [
        {
          fn: validators.required,
          args: ["name"],
        },
        {
          fn: function (model, length: number) {
            if (typeof model.formValues.name !== "undefined") {
              if (`${model.formValues.name}`.length !== length) {
                model.schemas[model.schemasIndex.name].errors!.push(
                  `name_length_must_be_${length}`
                );
              }
            }

            return model;
          },
          args: [5],
        },
      ],
    },
    {
      key: "age",

      validators: [
        {
          fn: validators.number,
          args: ["age"],
        },
      ],
    },
  ],
});

model.mount(document.querySelector("#form"));
```

## validators

In order to be able to execute validators by priority, they have been transformed into an array since version 0.2.0. Validator priority based on schema order and order of arrival in `Schema.validators`.

```ts
export interface SchemaInterface {
  /** formons-shema="key" */
  el?: Element;
  [key: string]: any;
}

export interface Schema {
  // --

  /**
   * validation functions are called before submitting form and after `Schema.onBeforeSubmit`.
   * They can also be called directly with the `Model.validate` function.
   *
   * The aim is to fill in `Model.isFormValid` and update `Schema.errors`.
   *
   * Validator priority based on schema order and order of arrival in `Schema.validators`.
   * */
  validators: Array<SchemaValidator>;

  // ---
}
```

## Events 🆕

Execute functions at different stages of your form.

```ts
export interface Schema {
  // ---

  events: SchemaEvents;

  // ---
}

export interface SchemaEvents {
  /** After creating the model */
  onModelCreated?: (key: string, model: Model) => Model | Promise<Model>;

  /** This function is called after the `Model.mount` function has been called. */
  onMounted?: (key: string, model: Model) => Model | Promise<Model>;

  /** this function is called before the form is submitted */
  onBeforeSubmit?: (key: string, model: Model) => Model | Promise<Model>;

  /** custom event like `onSave` for example  */
  [funcName: string]:
    | ((key: string, model: Model) => Model | Promise<Model>)
    | undefined;
}
```

### onModelCreated

After creating the model

```ts
onModelCreated?: (key: string, model: Model) => Model | Promise<Model>;
```

#### Example

```ts
await create({
  schemaOptions: [
    {
      key: "name",
      events: {
        async onModelCreated(key, model) {
          // your logic here

          return model;
        },
      },
    },
  ],
});
```

### onMounted

This function is called after the `Model.mount` function has been called.

```ts
onMounted?: (key: string, model: Model) => Model | Promise<Model>;
```

#### Example

```ts
const model = await create({
  schemaOptions: [{ key: "test" }],

  onFormValuesChanged(model) {
    onFormValuesChangedSpy(model);
  },
});
```

```ts
onBeforeSubmit?: (key: string, model: Model) => Model | Promise<Model>;
```

### custom event

custom event like `onSave` for example

#### Example

```ts
const model = await create({
  schemaOptions: [
    {
      key: "name",
      events: {
        async onBeforeSave(key, model) {
          return model;
        },
      },
    },
  ],
});

function saveData(model: Model) {
  model.schemas.forEach((schema) => {
    if (schema.events.onBeforeSave) {
      schema.events.onBeforeSave(schema.key, model);
    }
  });
}

saveData(model);
```

## Author

<img width="48" style="border-radius: 100%" src="https://avatars.githubusercontent.com/u/33329431" alt="Mamadou DIA - domutala">

Mamadou [@domutala](https://github.com/domutala)
