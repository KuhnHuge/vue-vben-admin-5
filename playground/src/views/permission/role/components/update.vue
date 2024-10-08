<script setup lang="ts">
import type { UpdateFormType } from '#/common/UpdateFormType';

import { onMounted, watch } from 'vue';

import { useVbenForm } from '#/adapter';
import { PermissionApi } from '#/api/abpClients/permission/permissionApi';

const props = defineProps<UpdateFormType>();
const emit = defineEmits(['updateVisible']);
const permissionApi = new PermissionApi();
const [BaseForm, api] = useVbenForm({
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
  },
  // 使用 tailwindcss grid布局
  // 提交函数
  handleSubmit: onSubmit,
  // 垂直布局，label和input在不同行，值为vertical
  layout: 'horizontal',
  // 水平布局，label和input在同一行
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入角色名称',
      },
      fieldName: 'name',
      label: '角色名称',
    },
    {
      component: 'Switch',
      componentProps: {
        class: 'w-auto',
      },
      defaultValue: false,
      fieldName: 'isDefault',
      label: '是否默认',
    },
    {
      component: 'Switch',
      componentProps: {
        class: 'w-auto',
      },
      defaultValue: true,
      fieldName: 'isPublic',
      label: '是否公开',
    },
    {
      component: 'Input',
      disabled: true,
      fieldName: 'concurrencyStamp',
      label: 'concurrencyStamp',
    },
  ],
  // 大屏一行显示3个，中屏一行显示2个，小屏一行显示1个
  // wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
});
async function onLoad(id: string) {
  const data = await permissionApi.role_getRoleDetail(id);
  if (!data) return;
  await api.setValues(data);
}
async function onSubmit(values: Record<string, any>) {
  const data = await permissionApi.role_updateRole(props.id, values);
  if (data) {
    emit('updateVisible', false);
    await api.resetForm();
  }
}

onMounted(() => {
  if (props.id) {
    onLoad(props.id);
  }
});
watch(
  () => props.id,
  async () => {
    if (props.id) {
      await onLoad(props.id);
    }
  },
);
</script>

<template>
  <BaseForm />
</template>
