<script setup lang="ts">
import type {
  VoloAbpPermissionManagementUpdatePermissionDto,
  VoloAbpPermissionManagementUpdatePermissionsDto,
} from '#/api/abpClients/permission/models';

import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import * as permissionModel from '#/api/abpClients/permission/models/index';
import { PermissionApi } from '#/api/abpClients/permission/permissionApi';

interface IPermissionTreeItem {
  canModify: boolean;
  children: IPermissionTreeItem[] | null;
  isGranted: boolean;
  key: string;
  title: string;
}

let providerKey = '';
const treeData = ref<IPermissionTreeItem[]>([]);
const permissionApi = new PermissionApi();
const [Drawer, drawerApi] = useVbenDrawer({
  onCancel() {
    drawerApi.close();
  },
  async onConfirm() {
    const model: VoloAbpPermissionManagementUpdatePermissionsDto = {
      permissions: getPermissionList(treeData.value),
    };
    await permissionApi.permission_updatePermissions('R', providerKey, model);
    drawerApi.close();
  },
  async onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const params = drawerApi.getData<Record<string, any>>();
      providerKey = params.name;
      const data = await permissionApi.permission_getPermissionList(
        'R',
        params.name,
      );
      if (data) {
        treeData.value = createTree(data);
      }
    }
  },
});

function createTree(
  dto: permissionModel.VoloAbpPermissionManagementGetPermissionListResultDto,
) {
  const tree: IPermissionTreeItem[] = [];
  if (!dto.groups) return tree;
  for (let i = 0; i < dto.groups.length; i++) {
    const groupItem: IPermissionTreeItem = {
      canModify: false,
      isGranted: false,
      key: dto.groups[i]?.name ?? '',
      title: dto.groups[i]?.displayName ?? '',
      children: [],
    };
    groupItem.children = createTreeByName(
      dto.groups[i]?.permissions,
      dto.groups[i]?.name ?? '',
    );
    tree.push(groupItem);
  }
  return tree;
}

function createTreeByName(
  array:
    | null
    | permissionModel.VoloAbpPermissionManagementPermissionGrantInfoDto[]
    | undefined,
  parentName?: string,
  length = 2,
): IPermissionTreeItem[] | null {
  const tree: IPermissionTreeItem[] = [];
  if (!array || array.length === 0 || !parentName) {
    return null;
  }
  const items = array.filter(
    (item) =>
      (item.name?.split('.').length ?? 0) === length &&
      (item.name?.startsWith(`${parentName}.`) ?? false),
  );
  if (items.length === 0) return null;
  items.forEach((item) => {
    const children = createTreeByName(array, item.name ?? '', length + 1);
    tree.push({
      canModify: true,
      isGranted: item.isGranted ?? false,
      key: item.name ?? '',
      title: item.displayName ?? '',
      children,
    });
  });
  return tree;
}

function getPermissionList(
  tree: IPermissionTreeItem[],
  list: null | VoloAbpPermissionManagementUpdatePermissionDto[] = null,
): VoloAbpPermissionManagementUpdatePermissionDto[] {
  if (!list) {
    list = [];
  }
  tree.forEach((item) => {
    if (item.canModify) {
      list.push({
        isGranted: item.isGranted,
        name: item.key,
      });
    }
    if (item.children) {
      getPermissionList(item.children, list);
    }
  });
  return list;
}

function grandAll(item: IPermissionTreeItem) {
  if (item.canModify) {
    item.isGranted = true;
  }
  item.children?.forEach(grandAll);
}

function cancelAll(item: IPermissionTreeItem) {
  if (item.canModify) {
    item.isGranted = false;
  }
  item.children?.forEach(cancelAll);
}
</script>

<template>
  <Drawer title="权限配置" title-tooltip="权限配置">
    <template #extra> extra</template>
    <a-tree :show-line="true" :tree-data="treeData">
      <template #title="{ data }: { data: IPermissionTreeItem }">
        {{ data.title }}
        <a-switch v-show="data.canModify" v-model:checked="data.isGranted" />
        <a-button
          v-if="data.children && data.children.length > 0"
          size="small"
          @click="grandAll(data)"
        >
          选中全部
        </a-button>
        <a-button
          v-if="data.children && data.children.length > 0"
          danger
          size="small"
          @click="cancelAll(data)"
        >
          取消全部
        </a-button>
      </template>
    </a-tree>

    <!-- <template #prepend-footer> slot </template> -->
    <!-- <template #append-footer> prepend slot </template> -->
  </Drawer>
</template>
