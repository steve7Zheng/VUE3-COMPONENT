<script setup>
import { computed } from "vue";
import { createNamespace } from "../../../utils/create";
import { iconProps } from "./icon";
defineOptions({
  name: "z-icon",
});
const bem = createNamespace("icon");
// 定义props
const props = defineProps(iconProps);
// 计算属性 来计算一个样式来处理
const style = computed(() => {
  const styleObj = {};
  if (props.size) {
    styleObj.fontSize = props.size + "px";
  }
  if (props.color) {
    styleObj.color = props.color;
  }
  return styleObj;
});
</script>
<template>
  <i :class="bem.b()" :style="style">
    <slot></slot>
  </i>
</template>
