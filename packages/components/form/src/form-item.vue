<script setup lang="ts">
import { createNamespace } from "@zi-shui/utils/create";
import { computed, inject, onMounted, provide, reactive, ref } from "vue";
import {
  FormItemValidateState,
  formItemProps,
  FormItemContext,
  formItemContextKey,
  FormItemRule,
  Arrayable,
} from "./form-item";
import { formContextKey } from "./form";
import AsyncValidator, { Values } from "async-validator";
const formContext = inject(formContextKey);
// console.log("FormContext", FormContext);
const bem = createNamespace("form-item");
defineOptions({
  name: "z-form-item",
});
const props = defineProps(formItemProps);
// 校验逻辑
const validateState = ref<FormItemValidateState>("");
const validateMessage = ref("");

// 不管rules是数组还是对象，统一转化为数组
const convertArray = (rules: Arrayable<FormItemRule> | undefined) => {
  return rules ? (Array.isArray(rules) ? rules : [rules]) : [];
};
// 将当前formItem的规则和form的规则合并
const _rules = computed(() => {
  const myRules: FormItemRule[] = convertArray(props.rules); // 自己的规则
  const formRules = formContext?.rules; // 表单的规则
  if (formRules && props.prop) {
    const _temp = formRules[props.prop];
    if (_temp) {
      myRules.push(...convertArray(_temp));
    }
  }
  return myRules;
});
// 过滤出在当前trigger条件下的校验规则
const getRuleFiltered = (trigger: string) => {
  // blur change
  const rules = _rules.value;
  return rules.filter((rule) => {
    if (!rule.trigger || !trigger) {
      return true;
    }
    if (Array.isArray(rule.trigger)) {
      return rule.trigger.includes(trigger);
    } else {
      return rule.trigger === trigger;
    }
  });
};
const onValidationSuccess = (state: FormItemValidateState) => {
  validateState.value = state;
  validateMessage.value = "";
};
const onValidationFail = (error: Values) => {
  validateState.value = "error";
  // console.log(validateState.value);
  validateMessage.value = error ? error.errors[0].message : "invalid";
};
// 注入formItemContext的地方会调用的validate方法  比如Input change或者blur时
const validate: FormItemContext["validate"] = async (trigger, callback?) => {
  // 拿到触发时机，校验是否通过可以调用callback或者调用promise.then方法
  const rules = getRuleFiltered(trigger);
  // 校验规则 rules
  // 数据源 formContext?.model
  // 校验的字段 props.prop
  // console.log(
  //   "trigger",
  //   trigger,
  //   "rules",
  //   rules,
  //   "data",
  //   FormContext?.modelValue,
  //   "prop",
  //   props.prop
  // );
  const modelName: string = props.prop || "";
  // 拿到校验器
  const validator = new AsyncValidator({
    [modelName as string]: rules,
  });
  const model = (formContext?.modelValue || {}) as any;
  return validator
    .validate({
      [modelName]: model?.[modelName],
    })
    .then(() => {
      console.log("success");
      onValidationSuccess("success");
    })
    .catch((errors) => {
      console.dir(errors);
      onValidationFail(errors);
      return Promise.reject(errors);
    });
};
const context: FormItemContext = {
  ...props,
  validate,
};
// console.log("fromItemContextKey", formItemContextKey);
provide(formItemContextKey, context);

onMounted(() => {
  formContext?.addField(context); // formItem的上下文加入到form的上下文中
});
</script>
<template>
  <div
    :class="[
      bem.b(),
      bem.is('success', validateState === 'success'),
      bem.is('error', validateState === 'error'),
    ]"
  >
    <label :class="bem.e('label')" v-if="label || $slots.label">
      <slot name="label">
        {{ label }}
      </slot>
    </label>
    <div :class="bem.e('content')">
      <slot></slot>
      <div :class="bem.e('error')">
        <slot name="error" v-if="validateState === 'error'">
          {{ validateMessage }}
        </slot>
      </div>
    </div>
  </div>
</template>
