<script setup lang="ts">
import { provide } from "vue";
import { formProps, formContextKey, FormContext } from "./form";
import { createNamespace } from "@zi-shui/utils/create";
import { FormItemContext } from "./form-item";
import { Values } from "async-validator/dist-types/interface";
const bem = createNamespace("form");
defineOptions({
  name: "z-form",
});
const props = defineProps(formProps);

const fields: FormItemContext[] = [];
// form的校验
const validate = async (
  callback?: (valid: boolean, fields?: Values) => void
) => {
  let errors: Values = {};
  for (const field of fields) {
    console.log("field", field);
    try {
      await field.validate("");
    } catch (e) {
      errors = {
        ...errors,
        ...(e as Values).fields,
      };
    }
  }
  if (!Object.keys(errors).length) {
    return callback?.(true); // 没有错误
  } else {
    return callback?.(false, errors);
  }
};
const addField: FormContext["addField"] = (field: FormItemContext) => {
  fields.push(field);
  console.log("fields", fields);
};
const context = {
  ...props,
  addField,
};
provide(formContextKey, context);
// 将form表单的校验方法暴露出去给用户 用户可以通过ref来进行校验
defineExpose({
  validate,
});
</script>
<template>
  <form :class="bem.b()">
    <slot></slot>
  </form>
</template>
