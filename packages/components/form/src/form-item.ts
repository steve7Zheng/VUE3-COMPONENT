// 定义formItem组件需要的属性和方法
// prop 校验的输入框的属性
// label 标签 输入框的标题
// rules 校验规则 输入框的校验规则
// show-message 是否显示校验错误信息

// change blur事件
import { ExtractPropTypes, InjectionKey, PropType } from "vue";
import type { RuleItem } from "async-validator";
export type Arrayable<T> = T | T[];
export interface FormItemRule extends RuleItem {
  trigger?: Arrayable<string>;
}
export const formItemValidateState = ["success", "error", ""] as const;
export type FormItemValidateState = (typeof formItemValidateState)[number];
export const formItemProps = {
  prop: String as PropType<string>,
  label: String as PropType<string>,
  rules: [Object, Array] as PropType<Arrayable<FormItemRule>>,
  showMessage: {
    type: Boolean as PropType<boolean>,
  },
} as const;

export type FormItemProps = Partial<ExtractPropTypes<typeof formItemProps>>;

export interface FormItemContext extends FormItemProps {
  validate: (
    trigger: string,
    callback?: (isValid: boolean) => void
  ) => Promise<any>;
}
export const formItemContextKey: InjectionKey<FormItemContext> = Symbol();
