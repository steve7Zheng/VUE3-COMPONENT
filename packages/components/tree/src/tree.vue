<script setup lang="ts">
import { ref, watch, computed, provide, onMounted } from "vue";
import {
  treeProps,
  TreeNode,
  TreeOption,
  Key,
  treeEmits,
  treeInjectKey,
} from "./tree";
import { createNamespace } from "@zi-shui/utils/create";
import ZTreeNode from "./treeNode.vue";
import ZVirtualList from "@zi-shui/components/virtual-list";
import { useSlots } from "vue";
const bem = createNamespace("tree");
defineOptions({
  name: "z-tree",
});
const props = defineProps(treeProps);
// 有了props 要对用户的数据进行格式化 格式化成一个固定的结果
// label key children
// 我们将props.data 格式化后放到tree中
const tree = ref<TreeNode[]>([]);
function createOption(key: string, label: string, children: string) {
  return {
    getKey(node: TreeOption) {
      return node[key] as string; // 用户传递的key
    },
    getLabel(node: TreeOption) {
      return node[label] as string; // 用户传递的label
    },
    getChildren(node: TreeOption) {
      return node[children] as TreeOption[]; // 用户传递的children
    },
  };
}
// 用来获取对应的字段
const treeOption = createOption(
  props.keyField,
  props.labelField,
  props.childrenField
);
// 将用户传递的数据进行格式化操作
function createTree(data: TreeOption[], parent: TreeNode | null = null): any {
  // console.log("createTree", data);
  function traversal(data: TreeOption[], parent: TreeNode | null = null) {
    return data.map((node) => {
      const children = treeOption.getChildren(node) || [];
      const treeNode: TreeNode = {
        key: treeOption.getKey(node),
        label: treeOption.getLabel(node),
        children: [], // 默认为空
        rawData: node,
        level: parent ? parent.level + 1 : 0,
        disabled: !!node.disabled,
        // 判断结点是否自带isLeaf属性 以自带为准 或者 孩子节点是否为空数组
        isLeaf: node.isLeaf ?? children.length === 0,
        parentKey: parent ? parent.key : undefined,
      };
      // 有孩子再去递归孩子 将其格式化成treeNode
      if (children.length > 0) {
        treeNode.children = traversal(children, treeNode);
      }
      return treeNode;
    });
  }
  const result: TreeNode[] = traversal(data, parent);
  return result;
}
// 监控数据变化 调用格式化方法 一上来先格式化一次
watch(
  () => props.data,
  (data: TreeOption[]) => {
    tree.value = createTree(data);
    // console.log("tree", tree.value);
  },
  { immediate: true }
);
// 希望将一颗树拍平  点击还能实现展开操作
// 需要展开的集合有哪些
const expandedKeysSet = ref(new Set(props.defaultExpandedKeys));
// 拍平树 这里需要依赖expandedKeysSet
const flattenTree = computed(() => {
  let expandedKeys = expandedKeysSet.value; // 要展开的keys有哪些

  let flattenNodes: TreeNode[] = []; //默认为空 拍平后的结果数组 [40, 30, 31, 32, 41]

  const nodes = tree.value || []; // 被格式化后的结点
  const stack: TreeNode[] = []; // 用于遍历树的栈
  for (let i = nodes.length - 1; i >= 0; i--) {
    stack.push(nodes[i]); // 将树的根结点压入栈中 [41, 40]
  }
  // 深度遍历
  while (stack.length) {
    const node = stack.pop();
    if (!node) continue; // 跳过空节点
    flattenNodes.push(node); // 将当前节点压入拍平后的结果数组
    if (expandedKeys.has(node.key)) {
      // 如果当前节点的key在要展开的集合中
      const children = node.children || []; // 孩子节点 [30, 31, 32]
      if (children.length > 0) {
        // 如果有孩子节点
        for (let i = children.length - 1; i >= 0; i--) {
          stack.push(children[i]); // 将孩子结点压入栈中
        }
      }
    }
  }

  return flattenNodes;
});
// console.log("flattenTree", flattenTree.value);
// 判断结点是否是展开状态
function isExpanded(node: TreeNode): boolean {
  return expandedKeysSet.value.has(node.key);
}
// 折叠结点
function collapse(node: TreeNode) {
  expandedKeysSet.value.delete(node.key);
}
// 实现异步加载
const loadingKeysRef = ref(new Set<Key>());
const triggerLoading = (node: TreeNode) => {
  // 没有孩子children 并且isLeaf为false 才可以触发加载
  if (!node.children?.length && !node.isLeaf) {
    const loadingKeys = loadingKeysRef.value;
    // 没有加载过这个结点 才可以触发加载
    if (!loadingKeys.has(node.key)) {
      loadingKeys.add(node.key);
      const onLoad = props.onLoad;
      if (onLoad) {
        onLoad(node.rawData).then((children) => {
          // 修改原来的结点
          node.rawData.children = children;
          // 更新自定义的node
          node.children = createTree(children, node);
          loadingKeys.delete(node.key);
        });
      }
    }
  }
};
// 展开结点
function expand(node: TreeNode) {
  expandedKeysSet.value.add(node.key);
  // 这里应该实现对应的加载逻辑
  triggerLoading(node);
}
// 切换展开状态
function toggleExpand(node: TreeNode) {
  const expandKeys = expandedKeysSet.value;
  // 如果当前结点是展开状态且不在动态加载 则可以折叠
  if (expandKeys.has(node.key) && !loadingKeysRef.value.has(node.key)) {
    collapse(node);
  } else {
    expand(node);
  }
}

// 实现选中结点
const emit = defineEmits(treeEmits);
const selectedKeysRef = ref<Key[]>([]);
watch(
  () => props.selectedKeys,
  (value) => {
    if (value) {
      selectedKeysRef.value = value;
    }
  },
  {
    immediate: true,
  }
);
// 处理选中的结点
const handleSelect = (node: TreeNode) => {
  let keys = Array.from(selectedKeysRef.value);
  if (!props.selectable) {
    //如果不可选 就不用往下执行逻辑了
    return;
  } else {
    if (props.multiple) {
      // 如果是多选
      let index = keys.findIndex((key) => key === node.key);
      if (index > -1) {
        keys.splice(index, 1); // 如果当前结点已经选中 则需要取消选中
      } else {
        keys.push(node.key); // 如果当前结点没有选中 则需要选中
      }
    } else {
      if (keys.includes(node.key)) {
        // 如果当前结点已经选中 则需要取消选中
        keys = [];
      } else {
        keys = [node.key];
      }
    }
  }
  emit("update:selectedKeys", keys);
};
provide(treeInjectKey, {
  slots: useSlots(),
});
const checkedKeysRef = ref(new Set(props.defaultCheckedKeys));
// 判断结点是否选中：根据传过来的checkedKeys判断
function isChecked(node: TreeNode): boolean {
  return checkedKeysRef.value.has(node.key);
}
// 判断结点是否可选 不可选的结点需要属性disabled为true
function isDisabled(node: TreeNode): boolean {
  return node.disabled;
}
const indeterminateRef = ref<Set<Key>>(new Set());
// 判断结点是否半选
function isIndeterminate(node: TreeNode): boolean {
  return indeterminateRef.value.has(node.key);
}
// 自上而下地选中所有子结点
function toggle(node: TreeNode, checked: boolean) {
  const checkedKeys = checkedKeysRef.value;
  if (checked) {
    // 选中的时候去掉半选状态
    indeterminateRef.value.delete(node.key);
  }
  // 维护当前的checkedKeys列表
  if (checked) {
    checkedKeys.add(node.key);
  } else {
    checkedKeys.delete(node.key);
  }
  const children = node.children || []; // 孩子节点
  if (children.length) {
    children.forEach((childNode) => {
      if (!childNode.disabled) {
        toggle(childNode, checked); // 递归更新子节点
      }
    });
  }
}
// 根据keys值寻找treeNode
function findNode(key: Key): TreeNode | undefined {
  return flattenTree.value.find((node) => node.key === key);
}
// 自下而上地更新结点选中状态
function updateCheckedKeys(node: TreeNode | undefined) {
  if (!node) return;
  // 自下而上地更新结点选中状态
  if (node.parentKey) {
    const parentNode = findNode(node.parentKey); // 找到父结点
    if (parentNode) {
      let allChecked = true; // 默认儿子全选
      let hasChecked = false; // 儿子有没有被选中
      const children = parentNode.children || [];
      // 遍历儿子结点 判断是否全选
      for (const node of children) {
        if (checkedKeysRef.value.has(node.key)) {
          hasChecked = true;
        } else if (indeterminateRef.value.has(node.key)) {
          allChecked = false;
          hasChecked = true;
        } else {
          allChecked = false;
        }
      }
      // 全选的话就把父结点也选中 只要有子节点为选中状态就把父结点也半选
      if (allChecked) {
        checkedKeysRef.value.add(parentNode.key);
        indeterminateRef.value.delete(parentNode.key);
      } else if (hasChecked) {
        checkedKeysRef.value.delete(parentNode.key);
        indeterminateRef.value.add(parentNode.key);
      }
      updateCheckedKeys(parentNode); // 递归更新父节点
    }
  }
}
// 当有结点的check值发生变化时触发的事件
function toggleCheck(node: TreeNode | undefined, checked: boolean) {
  // console.log("toggleCheck", node, checked);
  if (!node) return;
  // 自上而下更新子节点选中状态
  toggle(node, checked);
  // 再自下而上更新父节点选中状态
  updateCheckedKeys(node);
}
onMounted(() => {
  // 根据默认值初始化
  checkedKeysRef.value.forEach((key: Key) => {
    toggleCheck(findNode(key), true);
    updateCheckedKeys(findNode(key));
  });
});
</script>
<template>
  <div :class="bem.b()">
    <!-- <template v-for="node in flattenTree" :key="node.key">
      <div :class="bem.e('element')">{{ node.label }}</div>
    </template> -->
    <z-virtual-list :items="flattenTree" :remain="8" :size="35">
      <template #default="{ node }">
        <z-tree-node
          :key="node.key"
          :node="node"
          :expanded="isExpanded(node)"
          :loadingKeys="loadingKeysRef"
          :selectedKeys="selectedKeysRef"
          @select="handleSelect(node)"
          @toggle="toggleExpand(node)"
          :show-checkbox="showCheckbox"
          :checked="isChecked(node)"
          :disabled="isDisabled(node)"
          :indeterminate="isIndeterminate(node)"
          @check="toggleCheck"
        >
        </z-tree-node>
      </template>
    </z-virtual-list>
    <!-- <z-tree-node
      v-for="node in flattenTree"
      :key="node.key"
      :node="node"
      :expanded="isExpanded(node)"
      :loadingKeys="loadingKeysRef"
      :selectedKeys="selectedKeysRef"
      @select="handleSelect(node)"
      @toggle="toggleExpand(node)"
    >
    </z-tree-node> -->
  </div>
</template>
