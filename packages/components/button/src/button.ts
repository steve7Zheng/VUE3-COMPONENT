// 存储组件的属性和事件
// size 组件的大小
// type 颜色展示类型
// round 是否圆角
// disabled 是否禁用
// loading 是否显示加载中状态
// native-type 原生button的type属性
// icon-placement 图标位置

// 插槽 icon
import { ExtractPropTypes, Prop, PropType } from "vue";

export type Size = "small" | "medium" | "large";
export type Type =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "";
export type NativeType = "button" | "submit" | "reset";
export type IconPlacement = "left" | "right";
// 按钮组件的属性
export const buttonProps = {
  size: String as PropType<Size>,
  type: {
    type: String as PropType<Type>,
    validator: (value: string) => {
      // 自定义校验器
      return [
        "default",
        "primary",
        "success",
        "warning",
        "danger",
        "info",
        "",
      ].includes(value);
    },
    default: "",
  },
  round: Boolean as PropType<boolean>,
  disabled: Boolean as PropType<boolean>,
  loading: Boolean as PropType<boolean>,
  nativeType: {
    type: String as PropType<NativeType>,
    default: "button",
  },
  iconPlacement: {
    type: String as PropType<IconPlacement>,
    default: "left",
  },
} as const;
export const buttonEmits = {
  click: (e: MouseEvent) => e instanceof MouseEvent,
  mousedown: (e: MouseEvent) => e instanceof MouseEvent,
};

export type ButtonProps = ExtractPropTypes<typeof buttonProps>;
export type ButtonEmits = typeof buttonEmits;
