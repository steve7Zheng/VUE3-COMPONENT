// form 表单的属性
// model
// rules
// showMessage
import { ExtractPropTypes, InjectionKey, PropType } from "vue";
import { FormItemRule, Arrayable, FormItemContext } from "./form-item";
export const formProps = {
  modelValue: {
    type: Object as PropType<object>,
  },
  rules: {
    type: Object as PropType<Record<string, Arrayable<FormItemRule>>>,
  },
  showMessage: {
    type: Boolean,
    default: true,
  },
};
export type FormProps = Partial<ExtractPropTypes<typeof formProps>>;
export interface FormContext extends FormProps {
  addField: (field: FormItemContext) => void;
}
export const formContextKey: InjectionKey<FormContext> = Symbol();
