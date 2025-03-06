<script setup lang="ts">
import { AddCircle, Create } from "@vicons/ionicons5";
import type { TreeOption, Key } from "@zi-shui/components/tree/src/tree";
import { reactive, ref } from "vue";
import type { FormInstance } from "@zi-shui/components/form";
function createLabel(level: number): string {
  if (level === 4) return "道生一";
  if (level === 3) return "一生二";
  if (level === 2) return "二生三";
  if (level === 1) return "三生四";
  return "";
}
// 生成树形结构的数据
function createData(level = 4, parentKey = ""): any {
  if (!level) return [];
  const arr = new Array(20 - level).fill(0);
  return arr.map((_, idx: number) => {
    const key = parentKey + level + idx;
    return {
      label: createLabel(level),
      key,
      children: createData(level - 1, key),
    };
  });
}
function nextLabel(currentLabel?: string | number): string {
  if (!currentLabel) return "Out of Tao, One is born";
  if (currentLabel === "Out of Tao, One is born") return "Out of One, Two";
  if (currentLabel === "Out of One, Two") return "Out of Two, Three";
  if (currentLabel === "Out of Two, Three")
    return "Out of Three, the created universe";
  if (currentLabel === "Out of Three, the created universe")
    return "Out of Tao, One is born";
  return "";
}
function createData_() {
  return [
    {
      label: nextLabel(),
      key: 1,
      isLeaf: false, // isLeaf为false 表示点击的时候动态加载子结点
    },
    {
      label: nextLabel(),
      key: 2,
      isLeaf: false,
    },
  ];
}
const data = ref(createData());
// const data = ref<TreeOption[]>([
//   {
//     key: "0",
//     label: "0",
//     children: [
//       {
//         key: "0-0",
//         label: "0-0",
//       },
//       {
//         disabled: true,
//         key: "0-1",
//         label: "0-1",
//         children: [
//           {
//             key: "0-1-0",
//             label: "0-1-0",
//           },
//           {
//             key: "0-1-1",
//             label: "0-1-1",
//           },
//         ],
//       },
//     ],
//   },
// ]);
// console.log(data);
const handleLoad = (node: TreeOption) => {
  return new Promise<TreeOption[]>((resolve) => {
    setTimeout(() => {
      resolve([
        // 这个数据会作为当前展开的node的children属性
        {
          label: nextLabel(node.label),
          key: node.key + nextLabel(node.label),
          isLeaf: false,
        },
      ]);
    }, 1000);
  });
};
const value = ref<Key[]>([]);
const check = ref(true);
// checkbox 组件的change事件
const handleChange = (val: boolean | string | number): any => {
  console.log(val);
};
// ------------------------------------------------------
// 按钮点击事件
const handleClick = (e: MouseEvent) => {
  console.log("click", e);
};
// 按钮mousedown事件
const handleMouseDown = (e: MouseEvent) => {
  console.log("mousedown", e);
};
// ------------------------------------------------------
// Input组件的事件处理函数
const handleInputChange = (value: string | number) => {
  console.log("input change", value);
};
const handleInput = (value: string | number) => {
  console.log("input", value);
};
const handleBlur = (e: FocusEvent) => {
  console.log("blur", e);
};
const handleFocus = (e: FocusEvent) => {
  console.log("focus", e);
};
const handleClear = () => {
  console.log("clear");
};
const username = ref("");
// ------------------------------------------------------
const state = reactive({ username: "", password: "" });
// 表单实例
const fromRef = ref<FormInstance>();
// 表单验证函数
const validateForm = () => {
  const form = fromRef.value;
  form?.validate((valid: boolean, error: any) => {
    console.log(valid, error);
  });
};
</script>
<template>
  <z-icon :color="'red'" :size="20">
    <AddCircle></AddCircle>
  </z-icon>
  <z-icon :color="'blue'" :size="20">
    <AddCircle></AddCircle>
  </z-icon>
  <!-- 在使用树组件时，会传递一个树形结构 -->
  <!-- <z-tree
    :data="data"
    label-field="label"
    key-field="key"
    :children-field="'children'"
    :default-expanded-keys="[]"
  ></z-tree> -->
  <!-- {{ value }} -->
  <z-tree
    :data="data"
    :on-load="handleLoad"
    v-model:selected-keys="value"
    selectable
    :multiple="false"
    show-checkbox
    :default-checked-keys="['40', '41']"
  >
    <template #default="{ node }"> {{ node.key }} - {{ node.label }} </template>
  </z-tree>
  <z-checkbox
    v-model="check"
    :disabled="false"
    :indeterminate="true"
    label="结点"
    @change="handleChange"
  ></z-checkbox>
  <!-- selectable 表明可以选择结点，multiple 表明可以多选 selected-keys 选中的结点 -->
  <br />
  <br />
  <z-button
    size="medium"
    type="primary"
    :round="true"
    :disabled="false"
    :loading="false"
    :icon-placement="'left'"
    @click="handleClick"
    @mousedown="handleMouseDown"
  >
    <template #icon>
      <z-icon :size="20"><AddCircle></AddCircle></z-icon>
    </template>
    增加按钮
  </z-button>
  <br />
  <br />
  {{ username }}
  <z-input
    v-model="username"
    @input="handleInput"
    @change="handleInputChange"
    @blur="handleBlur"
    @focus="handleFocus"
    :disabled="false"
    :show-password="false"
    :clearable="true"
    @clear="handleClear"
  >
    <!-- <template #prepend>前置内容</template> -->
    <template #prefixIcon>
      <z-icon>
        <Create></Create>
      </z-icon>
    </template>
    <!-- <template #suffixIcon>
      <z-icon>
        <AddCircle></AddCircle>
      </z-icon>
    </template> -->
    <!-- <template #append>后置内容</template> -->
  </z-input>
  <br />
  <br />
  <z-form
    ref="fromRef"
    v-model="state"
    :rules="{
      username: {
        min: 6,
        max: 10,
        message: '用户名长度必须在6到10个字符之间',
        trigger: ['blur', 'change'],
      },
      password: {
        min: 6,
        max: 10,
        message: '密码长度必须在6到10个字符之间',
        trigger: ['blur', 'change'],
      },
    }"
  >
    <z-form-item
      prop="username"
      label="用户名"
      :rules="[{ required: true, message: '用户名不能为空', trigger: 'blur' }]"
    >
      <z-input v-model="state.username" :clearable="true"></z-input>
      <!-- <template #label>用户名</template> -->
      <!-- <template #error>用户名不能为空</template> -->
    </z-form-item>
    <z-form-item
      prop="password"
      label="密码"
      :rules="[{ required: true, message: '密码不能为空', trigger: 'blur' }]"
    >
      <z-input
        type="password"
        v-model="state.password"
        :show-password="true"
      ></z-input>
    </z-form-item>
    <z-button @click="validateForm">提交</z-button>
  </z-form>
</template>

<style scoped></style>
