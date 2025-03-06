import { ExtractPropTypes, PropType } from "vue";

export const checkboxProps = {
  modelValue: {
    type: [Boolean, String, Number] as PropType<boolean | string | number>,
    default: false,
  },
  indeterminate: {
    type: Boolean,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String as PropType<string>,
    default: "",
  },
} as const;

export type CheckboxProps = Partial<ExtractPropTypes<typeof checkboxProps>>;

export const checkboxEmits = {
  "update:modelValue": (value: boolean | string | number) =>
    typeof value === "boolean",
  change: (value: boolean | string | number) => typeof value === "boolean",
};
export type CheckboxEmits = typeof checkboxEmits;
