<script setup lang="ts">
import { createNamespace } from "@zi-shui/utils/create";
import { buttonProps, buttonEmits } from "./button";
import LoadingComponent from "@zi-shui/components/internal-icon/Loading";
import ZIcon from "@zi-shui/components/icon";
import { useSlots } from "vue";
const bem = createNamespace("button");
defineOptions({
  name: "z-button",
  inheritAttrs: false, // 阻止组件自带的属性继承
});
const props = defineProps(buttonProps);
const emits = defineEmits(buttonEmits);
const slots = useSlots();
const emitClick = (e: MouseEvent) => {
  emits("click", e);
};
const emitMousseDown = (e: MouseEvent) => {
  emits("mousedown", e);
};
</script>
<template>
  <button
    :class="[
      bem.b(),
      bem.m(type),
      bem.m(size),
      bem.is('round', round ?? false),
      bem.is('disabled', disabled ?? false),
      bem.is('loading', loading ?? false),
    ]"
    :type="nativeType"
    :disabled="disabled || loading"
    @click="emitClick"
    @mousedown="emitMousseDown"
  >
    <template v-if="iconPlacement === 'left'">
      <template v-if="loading">
        <z-icon>
          <LoadingComponent />
        </z-icon>
      </template>
      <template v-else-if="slots.icon">
        <z-icon>
          <Component :is="slots.icon"></Component>
        </z-icon>
      </template>
    </template>
    <slot></slot>
    <template v-if="iconPlacement === 'right'">
      <template v-if="loading">
        <z-icon>
          <LoadingComponent />
        </z-icon>
      </template>
      <template v-else-if="slots.icon">
        <z-icon>
          <Component :is="slots.icon"></Component>
        </z-icon>
      </template>
    </template>
  </button>
</template>
