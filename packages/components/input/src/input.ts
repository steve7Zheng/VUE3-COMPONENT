// 定义input所需要的属性
// type属性 默认是text
// modelValue / v-model = modelValue + @update:modelValue
// placeholder属性
// clearable属性
// show-password属性
// disabled
// readonly
// label

import { ExtractPropTypes, PropType } from "vue";
import { isString } from "@vue/shared";
export const inputProps = {
  type: {
    type: String as PropType<string>,
    default: "text",
  },
  modelValue: {
    type: [String, Number] as PropType<string | number>,
    default: "",
  },
  placeholder: {
    type: String as PropType<string>,
    default: "please input",
  },
  clearable: {
    type: Boolean as PropType<boolean>,
  },
  showPassword: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  readonly: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  label: {
    type: String as PropType<string>,
    default: "",
  },
} as const;
export type InputProps = ExtractPropTypes<typeof inputProps>;
// input组件的事件
export const inputEmits = {
  "update:modelValue": (value: string | number) => isString(value),
  input: (value: string | number) => isString(value),
  change: (value: string | number) => isString(value),
  focus: (e: FocusEvent) => e instanceof FocusEvent,
  blur: (e: FocusEvent) => e instanceof FocusEvent,
  clear: () => true,
};
export type inputEmits = typeof inputEmits;
