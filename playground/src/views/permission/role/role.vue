<script lang="ts" setup>
import type { ColumnType } from '@surely-vue/table/dist/src/components/interface';

import { ref, watch } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { Modal } from 'ant-design-vue';

import { PermissionApi } from '#/api/abpClients/permission/permissionApi';

import createRole from './components/create.vue';
import updateRole from './components/update.vue';
import permission from './permission.vue';

const [PermissionDrawer, PermissionDrawerApi] = useVbenDrawer({
  connectedComponent: permission,
});
const permissionApi = new PermissionApi();
const columns: ColumnType[] = [
  {
    dataIndex: 'name',
    title: '角色名称',
  },
  {
    customRender: (opt) => {
      return opt.value ? '是' : '否';
    },
    dataIndex: 'isDefault',
    title: '是否默认',
  },
  {
    customRender: (opt) => {
      return opt.value ? '是' : '否';
    },
    dataIndex: 'isStatic',
    title: '是否静态',
  },
  {
    customRender: (opt) => {
      return opt.value ? '是' : '否';
    },
    dataIndex: 'isPublic',
    title: '是否公开',
  },
  {
    fixed: 'right',
    key: 'operation',
    title: '操作',
    width: 200,
  },
];
const dataSource = ref<any[]>([]);
const modalMode = ref('');
const createVisible = ref(false);
const updateVisible = ref(false);
const updateFormId = ref('');
watch(
  () => modalMode.value,
  async (newVal, _oldVal) => {
    if (newVal === 'create') {
      createVisible.value = true;
      updateVisible.value = false;
    } else if (newVal === 'update') {
      createVisible.value = false;
      updateVisible.value = true;
    } else {
      createVisible.value = false;
      updateVisible.value = false;
    }
  },
);
getData();

async function getData() {
  const result = await permissionApi.role_getRoleList();
  if (!result) return;
  dataSource.value = result.items as any[];
}

async function handleDelete(id: string) {
  Modal.confirm({
    // content: createVNode('div', { style: 'color:red;' }, 'Some descriptions'),
    // icon: createVNode(ExclamationCircleOutlined),
    async onOk() {
      await permissionApi.role_deleteRole(id);
      await getData();
    },
    title: '确定删除？',
  });
}
function openPermissionDrawer(name: string) {
  PermissionDrawerApi.setData({ name });
  PermissionDrawerApi.open();
}
</script>
<template>
  <div>
    <s-table
      :columns="columns"
      :data-source="dataSource"
      :pagination="false"
      :scroll="{ y: 400 }"
      row-key="id"
    >
      <template #title>
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
          "
        >
          <span>角色列表</span>
          <div>
            <a-button type="primary" @click="modalMode = 'create'">
              添加角色
            </a-button>
          </div>
        </div>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'operation'">
          <div class="operation-column">
            <a
              style="color: #88f"
              @click="
                updateFormId = record.id;
                modalMode = 'update';
              "
              >编辑
            </a>
            <a
              style="color: rgb(136 194 255)"
              @click="openPermissionDrawer(record.name)"
            >
              更改权限
            </a>
            <a style="color: rgb(255 136 140)" @click="handleDelete(record.id)">
              删除
            </a>
          </div>
        </template>
      </template>
    </s-table>
    <a-modal
      v-model:open="createVisible"
      :closable="false"
      :footer="null"
      @cancel="modalMode = ''"
      @ok="modalMode = ''"
    >
      <create-role
        @update-visible="
          async (visible) => {
            if (!visible) {
              modalMode = '';
              await getData();
            }
          }
        "
      />
    </a-modal>
    <a-modal
      v-model:open="updateVisible"
      :closable="false"
      :footer="null"
      @cancel="modalMode = ''"
      @ok="modalMode = ''"
    >
      <update-role
        :id="updateFormId"
        @update-visible="
          async (visible) => {
            if (!visible) {
              modalMode = '';
              await getData();
            }
          }
        "
      />
    </a-modal>
    <PermissionDrawer />
  </div>
</template>
<style lang="less" scoped>
.operation-column a {
  margin-left: 10px;
}
.operation-column a:hover {
  color: #035ec7 !important;
}
</style>
