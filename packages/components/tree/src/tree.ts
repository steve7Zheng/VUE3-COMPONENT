import { ExtractPropTypes, InjectionKey, PropType, SetupContext } from "vue";
export type Key = string | number;
// 原始的 TreeOption 数据结构
export interface TreeOption {
  label?: Key;
  key: Key;
  children?: TreeOption[];
  isLeaf?: boolean;
  disabled?: boolean;
  [key: string]: unknown;
}
// 格式化后的 TreeNode 数据结构
export interface TreeNode extends Required<TreeOption> {
  level: number;
  rawData: TreeOption;
  children: TreeNode[];
  isLeaf: boolean;
  parentKey: Key | undefined;
}
// tree组件的props
export const treeProps = {
  data: {
    type: Array as PropType<TreeOption[]>,
    default: () => [],
  },
  defaultExpandedKeys: {
    type: Array as PropType<Key[]>,
    default: () => [],
  },
  labelField: {
    type: String,
    default: "label",
  },
  keyField: {
    type: String,
    default: "key",
  },
  childrenField: {
    type: String,
    default: "children",
  },
  onLoad: Function as PropType<(node: TreeOption) => Promise<TreeOption[]>>,
  selectedKeys: {
    type: Array as PropType<Key[]>,
    default: () => [],
  },
  selectable: {
    type: Boolean,
    default: true,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  defaultCheckedKeys: {
    type: Array as PropType<Key[]>,
    default: () => [],
  },
  showCheckbox: {
    type: Boolean,
    default: false,
  },
} as const;
// treeNode组件的props
export const treeNodeProps = {
  node: {
    type: Object as PropType<TreeNode>,
    required: true,
  },
  expanded: {
    type: Boolean,
    require: true,
  },
  loadingKeys: {
    type: Object as PropType<Set<Key>>,
    require: true,
  },
  selectedKeys: {
    type: Array as PropType<Key[]>,
    default: () => [],
  },
  showCheckbox: {
    type: Boolean,
    default: false,
  },
  checked: {
    type: Boolean,
  },
  disabled: {
    type: Boolean,
  },
  indeterminate: {
    type: Boolean,
  },
} as const;

// treeNode组件的emits事件
export const treeNodeEmits = {
  toggle: (node: TreeNode) => node,
  select: (key: Key) => key,
  check: (node: TreeNode, val: boolean) => typeof val === "boolean",
};
// tree组件的emits事件
export const treeEmits = {
  // 内部发射的事件用来同步响应式数据
  "update:selectedKeys": (keys: Key[]) => keys,
};
export type treeNodeProps = Partial<ExtractPropTypes<typeof treeNodeProps>>;

// Partial 让属性变得可传可不传
export type TreeProps = Partial<ExtractPropTypes<typeof treeProps>>;

export interface TreeContext {
  slots: SetupContext["slots"];
  // emit: SetupContext<type of treeEmits>["emit"],
}
// 此变量作为提供出去的属性
export const treeInjectKey: InjectionKey<TreeContext> = Symbol();

export const treeNodeContentProps = {
  node: {
    type: Object as PropType<TreeNode>,
    required: true,
  },
};
