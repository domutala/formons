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

## Documentation 📚

The comprehensive documentation for Formons is currently under construction. To get started, it is recommended to use the well-written typing to begin.
