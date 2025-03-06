// 这里准备组件相关的属性和ts的类型
import { ExtractPropTypes, Prop, PropType } from "vue"; // 可以推导出组件属性类型

// 定义组件属性
export const iconProps = {
  color: String,
  size: [Number, String] as PropType<string | number>,
} as const;

export type IconProps = ExtractPropTypes<typeof iconProps>; // 导出组件属性类型
