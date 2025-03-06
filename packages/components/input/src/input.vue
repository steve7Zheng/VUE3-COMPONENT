<script setup lang="ts">
import {
  computed,
  inject,
  nextTick,
  onMounted,
  ref,
  useSlots,
  watch,
} from "vue";
import { createNamespace } from "@zi-shui/utils/create";
import { inputProps, inputEmits } from "./input";
import { useAttrs } from "vue";
import { EyeSharp, EyeOffSharp, BackspaceOutline } from "@vicons/ionicons5";
import { formItemContextKey } from "../../form/src/form-item";
const formItemContext = inject(formItemContextKey); // 获取formItem的上下文
const bem = createNamespace("input");
defineOptions({
  name: "z-input",
});
const props = defineProps(inputProps);
const emits = defineEmits(inputEmits);
const slots = useSlots();
const attrs = useAttrs();
// ---------------------------------------------
const inputRef = ref<HTMLInputElement | null>(null);
// 监控modelValue变化 重新赋值
watch(
  () => props.modelValue,
  (value) => {
    // 进行formItem的校验
    if (formItemContext) {
      formItemContext.validate("change");
    }
    setNativeInputValue();
  }
);
const setNativeInputValue = () => {
  const inputElement = inputRef.value;
  if (!inputElement) {
    return;
  }
  inputElement.value = String(props.modelValue);
};
onMounted(() => {
  // 组件加载完毕后设置一次输入框的值
  setNativeInputValue();
});
// ---------------------------------------------
// 触发emit事件
const handleInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value;
  emits("input", value); // 用户可以自定义input事件的回调 这里把input的value传给用户 方便用户定义回调函数
  emits("update:modelValue", value); // 触发modelValue的更新 双向绑定
};
const handleChange = (e: Event) => {
  const value = (e.target as HTMLInputElement).value;
  emits("change", value); // 用户可以自定义change事件的回调 这里把change的value传给用户 方便用户定义回调函数
};
const handleBlur = (e: FocusEvent) => {
  // 进行formItem的校验
  if (formItemContext) {
    formItemContext.validate("blur");
  }
  emits("blur", e); // 用户可以自定义blur事件的回调 这里把blur的事件对象传给用户 方便用户定义回调函数
};
const handleFocus = (e: FocusEvent) => {
  emits("focus", e); // 用户可以自定义focus事件的回调 这里把focus的事件对象传给用户 方便用户定义回调函数
};
const focus = async () => {
  await nextTick(); // 等待dom更新
  inputRef.value?.focus();
};
// ---------------------------------------------
// 控制密码的隐藏显示
const passwordVisible = ref(false);
const handlePasswordVisible = () => {
  passwordVisible.value = !passwordVisible.value;
  focus();
};
// 控制密码小眼睛图标的显示隐藏
const showPwdVisible = computed(() => {
  return (
    props.modelValue && props.showPassword && !props.disabled && !props.readonly
  );
});
// ---------------------------------------------
// 控制清空按钮的显示隐藏
const showClear = computed(() => {
  return (
    props.modelValue && props.clearable && !props.disabled && !props.readonly
  );
});
// 清空
const handleClear = () => {
  emits("update:modelValue", ""); // 触发modelValue的更新 双向绑定
  emits("clear"); // 用户可以自定义clear事件的回调 这里触发clear事件
  focus();
};
</script>
<template>
  <div :class="bem.b()">
    <div v-if="slots.prepend" :class="bem.be('group', 'prepend')">
      <slot name="prepend"></slot>
    </div>

    <div :class="bem.e('wrapper')">
      <span v-if="slots.prefixIcon" :class="bem.e('prefix')">
        <slot name="prefixIcon"></slot>
      </span>
      <!-- 需要显示密码 再看当前应该是文本还是密码 -->
      <input
        :type="showPassword ? (passwordVisible ? 'text' : 'password') : type"
        v-bind="attrs"
        :class="[bem.e('inner'), bem.is('disabled', disabled)]"
        ref="inputRef"
        @input="handleInput"
        @change="handleChange"
        @blur="handleBlur"
        @focus="handleFocus"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
      />

      <span
        v-if="slots.suffixIcon || showPassword || showClear"
        :class="bem.e('suffix')"
      >
        <z-icon
          v-if="showPwdVisible"
          @click="handlePasswordVisible"
          :style="{ lineHeight: '16px', cursor: 'pointer', color: '#ccc' }"
        >
          <EyeSharp v-if="passwordVisible"></EyeSharp>
          <EyeOffSharp v-else></EyeOffSharp>
        </z-icon>
        <z-icon
          v-if="showClear"
          @click="handleClear"
          :style="{ lineHeight: '16px', cursor: 'pointer', color: '#ccc' }"
        >
          <BackspaceOutline></BackspaceOutline>
        </z-icon>
        <slot name="suffixIcon" v-else></slot>
      </span>
    </div>

    <div v-if="slots.append" :class="bem.be('group', 'append')">
      <slot name="append"></slot>
    </div>
  </div>
</template>
