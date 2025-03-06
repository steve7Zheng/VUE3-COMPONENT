<script setup lang="ts">
import Switcher from "@zi-shui/components/internal-icon/Switcher";
import Loading from "@zi-shui/components/internal-icon/Loading";
import ZIcon from "@zi-shui/components/icon";
import { ref, computed, inject } from "vue";
import { treeNodeProps, treeNodeEmits, treeInjectKey } from "./tree";
import { createNamespace } from "@zi-shui/utils/create";
import ZTreeNodeContent from "./tree-node-content";
import ZCheckbox from "@zi-shui/components/checkbox";
const bem = createNamespace("tree-node");
const props = defineProps(treeNodeProps);
const emits = defineEmits(treeNodeEmits);
function handleExpand() {
  emits("toggle", props.node);
}
const isLoading = computed(() => {
  return props.loadingKeys?.has(props.node.key);
});
const isSelected = computed(() => {
  return props.selectedKeys?.includes(props.node.key);
});
const handleSelected = () => {
  if (props.node.disabled) return;
  emits("select", props.node.key);
};
// const treeContext = inject(treeInjectKey);
// console.log(treeContext);
const handleCheckChange = (value: boolean | string | number): any => {
  emits("check", props.node, value as boolean);
};
</script>
<template>
  <div
    :class="[
      bem.b(),
      bem.is('selected', isSelected),
      bem.is('disabled', node.disabled),
    ]"
  >
    <div
      :class="[bem.e('content')]"
      :style="{ paddingLeft: `${node.level * 16}px` }"
    >
      <span
        :class="[
          bem.e('expand-icon'),
          { expanded: expanded && !node.isLeaf },
          bem.is('leaf', node.isLeaf),
        ]"
        @click="handleExpand"
      >
        <z-icon size="25">
          <Switcher v-if="!isLoading"></Switcher>
          <Loading v-else></Loading>
        </z-icon>
      </span>
      <z-checkbox
        v-if="showCheckbox"
        :modelValue="checked"
        :disabled="disabled"
        :indeterminate="indeterminate"
        @change="handleCheckChange"
      ></z-checkbox>
      <span @click="handleSelected" :class="bem.e('label')">
        <!-- {{ node?.label }} -->
        <z-tree-node-content :node="node"></z-tree-node-content>
      </span>
    </div>
  </div>
</template>
