<script lang="ts" setup>
// import { create, use } from "~/../src";
import { create, use } from "form";

use((model) => {
  model = model.addValidator("mytype", model.validators.string);
  return model;
});

const model = ref(
  create({
    schemas: [
      {
        key: "id",
        onCreate: "generateUUID",

        _validators: {
          uuid: true,
          required: true,
        },

        _interface: {
          hidden: true,
        },
      },
      {
        key: "name",

        _validators: {
          string: true,
          required: true,
        },

        _interface: {
          type: "string",
        },
      },
      {
        key: "mytype",

        _validators: {
          mytype: true,
          required: true,
        },

        _interface: {
          type: "mytype",
          componentProps: {
            width: "1/2",
            placeholder: "My type",
          },
        },
      },
      {
        key: "address",

        _validators: {
          string: true,
          required: false,
        },

        _interface: {
          type: "string",
          componentProps: {
            placeholder: "Your addess",
            width: "1/2",
          },
        },
      },
      {
        key: "age",

        _validators: {
          number: true,
          required: true,
        },

        _interface: {
          type: "number",
          placeholder: "Your age",
        },
      },
      {
        key: "sexe",
        default: 1,

        _validators: {
          string: true,
          required: true,
        },

        _interface: {
          type: "select",
          items: [
            { title: "Homme", value: 1, props: { icon: "yeah 1" } },
            { title: "Femme", value: 2, props: { icon: "yeah 2" } },
          ],
          componentProps: {
            label: "Sexe",
          },
        },
      },
      {
        key: "manager",

        _validators: {
          // required: true,
        },

        _interface: {
          type: "boolean",
          props: {
            color: "primary",
          },
        },
      },
      {
        key: "alert",

        _validators: {
          // required: true,
        },

        _interface: {
          type: "alert",
          props: {
            color: "info",
            text: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vel laborum non voluptates rerum? Distinctio, delectus corrupti porro impedit vel animi debitis ab, eum corporis accusantium quod cum, dignissimos vero excepturi!",
          },
        },
      },
      {
        key: "lien",

        _validators: {
          required: true,
          regex: {
            fn: "regex",
            args: {
              regex:
                /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-]*)*(\?.*)?(#.*)?$/,
              message: "must_be_url",
            },
          },
        },

        _interface: {
          type: "url",
          componentProps: {
            label: "url",
          },
        },
      },
    ],
    watch: onFormvaluesChange,
  })
);

onMounted(onFormvaluesChange);
function onFormvaluesChange() {
  const age = Number(model.value.formValues.age);

  if (!isNaN(age) && age < 18) {
    model.value.schemas[model.value.schemasIndex.address]._interface.hidden =
      true;
  } else {
    model.value.schemas[model.value.schemasIndex.address]._interface.hidden =
      false;
  }

  return model.value;
}

onMounted(() => {});
</script>

<template>
  <v-app>
    <v-container>
      <v-form @submit.prevent="model.validate()" class="dform">
        <template v-for="schema in model.schemas" :key="schema.key">
          <template v-if="!schema._interface.hidden">
            <div
              class="dform-schema--container"
              :class="[schema._interface.componentProps?.width]"
            >
              <v-text-field
                v-if="schema._interface.type === 'boolean'"
                :error-messages="schema._errors"
                rounded="lg"
                variant="outlined"
                bg-color="rgba(var(--v-theme-on-background), 0.03)"
                flat
              >
                <template #prepend>
                  <v-switch
                    v-model="model.formValues[schema.key]"
                    v-bind="schema._interface.props"
                    inset
                    hide-details
                  ></v-switch>
                </template>
              </v-text-field>

              <v-select
                v-else-if="schema._interface.type === 'select'"
                :items="schema._interface.items"
                v-model="model.formValues[schema.key]"
                v-bind="schema._interface.componentProps"
                rounded="lg"
                variant="outlined"
                bg-color="rgba(var(--v-theme-on-background), 0.03)"
                flat
              >
                <template #selection="{ item }">
                  <div class="d-flex align-ce">
                    <template v-if="item.props.icon">
                      <i :class="item.props.icon" class="mr-3">**</i>
                    </template>

                    {{ item.title }}
                  </div>
                </template>

                <template #item="{ props, item }">
                  <v-list-item v-bind="props">
                    <template v-if="props.icon" #prepend>
                      <i :class="props.icon" class="mr-3">**</i>
                    </template>
                  </v-list-item>
                </template>
              </v-select>
              <v-alert
                v-else-if="schema._interface.type === 'alert'"
                v-bind="schema._interface.props"
              >
              </v-alert>
              <v-text-field
                v-else
                v-model="model.formValues[schema.key]"
                v-bind="schema._interface.componentProps"
                :type="schema._interface.type"
                :error-messages="schema._errors"
                rounded="lg"
                variant="outlined"
                bg-color="rgba(var(--v-theme-on-background), 0.03)"
                flat
              >
              </v-text-field>
            </div>
          </template>
        </template>

        <v-btn type="submit">submit</v-btn>
      </v-form>
    </v-container>
  </v-app>
</template>

<style lang="scss">
.dform {
  display: flex;
  flex-wrap: wrap;

  .dform-schema--container {
    width: 100%;
    padding: 5px;

    &[class*="1/3"] {
      width: calc(100% / 3);
    }
    &[class*="1/2"] {
      width: calc(100% / 2);
    }
  }
}
</style>
