<script setup lang="ts">
import { createNamespace } from "@zi-shui/utils/create";
import { checkboxProps, checkboxEmits } from "./checkbox";
import { computed, onMounted, ref, watch } from "vue";
const bem = createNamespace("checkbox");
const props = defineProps(checkboxProps);
const emits = defineEmits(checkboxEmits);
defineOptions({
  name: "z-checkbox",
});
// checkbox 值 双向绑定
const model = computed({
  get() {
    return props.modelValue;
  },
  set(value: boolean | string | number) {
    emits("update:modelValue", value);
  },
});

const inputRef = ref<HTMLInputElement>();
// 半选状态变化时同步input的indeterminate
function indeterminateChange(val: boolean) {
  inputRef.value!.indeterminate = val;
}
watch(() => props.indeterminate, indeterminateChange);
// 一上来同步checkbox的indeterminate
onMounted(() => {
  indeterminateChange(props.indeterminate);
});
// 点击checkbox时触发change事件
const handleChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const value = target.checked ? true : false;
  emits("change", value);
};
</script>
<template>
  <label :class="bem.b()">
    <span :class="bem.e('input')">
      <input
        type="checkbox"
        v-model="model"
        ref="inputRef"
        :disabled="disabled"
        :value="label"
        @change="handleChange"
      />
    </span>
    <span v-if="$slots.default || label" :class="bem.e('label')">
      <slot></slot>
      <template v-if="!$slots.default">{{ label }}</template>
    </span>
  </label>
</template>
