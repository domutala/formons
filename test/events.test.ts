/**
 * @jest-environment jsdom
 */

import { Model } from "../src/interfaces/Model";
import { create } from "../src";

describe("events", () => {
  beforeEach(() => {
    document.body.innerHTML = `
    <form id="form">
        <input type="text" formons-shema="test" />
        <button type="submit">Click me</button>
    </form>
    `;
  });

  test("onModelCreated", async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));

    const onModelCreatedSpy = jest.fn();

    await create({
      schemaOptions: [
        {
          key: "test",
          events: {
            async onModelCreated(key, model) {
              onModelCreatedSpy(key, model);
              return model;
            },
          },
        },
      ],
    });

    expect(onModelCreatedSpy).toHaveBeenCalled();
  });

  test("onMounted", async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));

    const form = document.createElement("form") as HTMLFormElement;
    const onMountedSpy = jest.fn();

    const model = await create({
      schemaOptions: [
        {
          key: "test",
          events: {
            async onMounted(key, model) {
              onMountedSpy(key, model);
              return model;
            },
          },
        },
      ],
    });

    await model.mount(form);

    expect(onMountedSpy).toHaveBeenCalled();
  });

  test("onFormValuesChanged", async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));

    const onFormValuesChangedSpy = jest.fn();

    const model = await create({
      schemaOptions: [{ key: "test" }],

      onFormValuesChanged(model) {
        onFormValuesChangedSpy(model);
      },
    });

    model.formValues.test = "tester";

    expect(onFormValuesChangedSpy).toHaveBeenCalled();
  });

  test("onBeforeSubmit", async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));

    const form = document.createElement("form") as HTMLFormElement;
    const onBeforeSubmitSpy = jest.fn();

    const model = await create({
      schemaOptions: [
        {
          key: "test",
          events: {
            async onBeforeSubmit(key, model) {
              onBeforeSubmitSpy(key, model);
              return model;
            },
          },
        },
      ],
    });

    await model.mount(form);
    model.submit();

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(onBeforeSubmitSpy).toHaveBeenCalled();
  });

  test("onSubmit", async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));

    const form = document.createElement("form") as HTMLFormElement;
    const onSubmitSpy = jest.fn();

    const model = await create({
      schemaOptions: [{ key: "test" }],

      onSubmit(model) {
        onSubmitSpy(model);
      },
    });

    await model.mount(form);
    model.submit();

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(onSubmitSpy).toHaveBeenCalled();
  });

  test("customEvent", async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));

    const ononBeforeSaveSpy = jest.fn();

    const model = await create({
      schemaOptions: [
        {
          key: "test",
          events: {
            async onBeforeSave(key, model) {
              ononBeforeSaveSpy(key, model);
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
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(ononBeforeSaveSpy).toHaveBeenCalled();
  });
});
