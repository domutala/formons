/**
 * @jest-environment jsdom
 */

import { create } from "../src";
import validators from "../src/validators";

describe("validators", () => {
  beforeEach(() => {
    document.body.innerHTML = `
    <form id="form">
        <input type="text" formons-shema="test" />
        <button type="submit">Click me</button>
    </form>
    `;
  });

  test("isValidatorCalled", async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));

    const form = document.createElement("form") as HTMLFormElement;
    const isValidatorCalledSpy = jest.fn();

    const model = await create({
      schemaOptions: [
        {
          key: "test",
          validators: [
            {
              fn: function (model) {
                isValidatorCalledSpy(model);
                return model;
              },
            },
          ],
        },
      ],
    });

    await model.mount(form);
    model.submit();

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(isValidatorCalledSpy).toHaveBeenCalled();
  });

  test("isValidatorCalledWithArgs", async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));

    const form = document.createElement("form") as HTMLFormElement;
    const isValidatorCalledSpy = jest.fn();

    const model = await create({
      schemaOptions: [
        {
          key: "test",
          validators: [
            {
              fn: function (model, length: number) {
                expect(length).toBe(5);
                isValidatorCalledSpy(model);

                if (typeof model.formValues.test !== "undefined") {
                  if (`${model.formValues.test}`.length !== length) {
                    model.schemas[model.schemasIndex.test].errors!.push(
                      `test_length_must_be_${length}`
                    );
                  }
                }

                return model;
              },
              args: [5],
            },
          ],
        },
      ],
      base: { test: "333" },
    });

    await model.mount(form);
    model.submit();

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(isValidatorCalledSpy).toHaveBeenCalled();
  });

  test("callValidate", async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));

    const isValidatorCalledSpy = jest.fn();

    const model = await create({
      schemaOptions: [
        {
          key: "test",
          validators: [
            {
              fn: function (model, length: number) {
                expect(length).toBe(5);
                isValidatorCalledSpy(model);

                if (typeof model.formValues.test !== "undefined") {
                  if (`${model.formValues.test}`.length !== length) {
                    model.schemas[model.schemasIndex.test].errors!.push(
                      `test_length_must_be_${length}`
                    );
                  }
                }

                return model;
              },
              args: [5],
            },
          ],
        },
      ],
      base: { test: "333" },
    });

    model.validate();

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(isValidatorCalledSpy).toHaveBeenCalled();
    expect(model.isFormValid).toBe(false);
  });

  test("useValidator", async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));

    const model = await create({
      schemaOptions: [
        {
          key: "test",
          validators: [
            {
              fn: validators.boolean,
              args: ["test"],
            },
          ],
        },
      ],
      base: { test: "this is string" },
    });

    model.validate();

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(model.isFormValid).toBe(false);
  });
});
