// noinspection JSUnusedGlobalSymbols

import type { AxiosResponse } from 'axios';

import { TokenApi } from '#/api/abpClients/tokenApi';

import * as models from './models/index';

export class PermissionApi extends TokenApi {
  /**
   * 获取权限列表
   * @param providerName
   * @param providerKey
   * @returns 返回一个Promise，解析为权限列表或undefined
   */
  public async permission_getPermissionList(
    providerName?: string,
    providerKey?: string,
  ): Promise<
    models.VoloAbpPermissionManagementGetPermissionListResultDto | undefined
  > {
    const axiosResponse = await this.client.get<
      AxiosResponse<models.VoloAbpPermissionManagementGetPermissionListResultDto>
    >('/api/permission-management/permissions', {
      params: { providerKey, providerName },
    });
    if (axiosResponse?.data) {
      return axiosResponse.data;
    }
    return undefined;
  }

  public async permission_updatePermissions(
    providerName: string,
    providerKey: string,
    model: models.VoloAbpPermissionManagementUpdatePermissionsDto,
  ): Promise<void> {
    await this.client.put(`/api/permission-management/permissions`, model, {
      params: { providerKey, providerName },
    });
  }

  /**
   * 异步创建角色
   * @param model 角色创建DTO模型，包含角色的相关信息
   * @returns 返回一个Promise，解析为角色DTO或undefined
   */
  public async role_createRole(
    model: models.VoloAbpIdentityIdentityRoleCreateDto,
  ): Promise<models.VoloAbpIdentityIdentityRoleDto | undefined> {
    const axiosResponse = await this.client.post<
      AxiosResponse<models.VoloAbpIdentityIdentityRoleDto>
    >('/api/identity/roles', model);
    if (axiosResponse?.data) {
      return axiosResponse.data;
    }
    return undefined;
  }

  /**
   * 删除角色
   * @param id 角色ID
   */
  public async role_deleteRole(id: string): Promise<void> {
    await this.client.delete(`/api/identity/roles/${id}`);
  }

  /**
   * 获取角色详情
   * @param id 角色ID
   * @returns 返回一个Promise，解析为角色详情或undefined
   */
  public async role_getRoleDetail(
    id: string,
  ): Promise<models.VoloAbpIdentityIdentityRoleDto | undefined> {
    const axiosResponse = await this.client.get<
      AxiosResponse<models.VoloAbpIdentityIdentityRoleDto>
    >(`/api/identity/roles/${id}`);
    if (axiosResponse?.data) {
      return axiosResponse.data;
    }
    return undefined;
  }

  /**
   * 获取所有角色列表
   * @returns 返回一个Promise，解析为角色列表或undefined
   */
  public async role_getRoleList(): Promise<
    models.ListResultDto1VoloAbpIdentityIdentityRoleDto | undefined
  > {
    const axiosResponse = await this.client.get<
      AxiosResponse<models.ListResultDto1VoloAbpIdentityIdentityRoleDto>
    >('/api/identity/roles/all');
    if (axiosResponse?.data) {
      return axiosResponse.data;
    }
    return undefined;
  }

  /**
   * 获取角色列表分页数据
   * @param filter 角色名称
   * @param sorting 排序字段
   * @param skipCount 跳过的记录数
   * @param maxResultCount 最大结果数
   * @returns 返回一个Promise，解析为角色列表或undefined
   */
  public async role_getRoleListPaged(
    filter?: string,
    sorting?: string,
    skipCount?: number,
    maxResultCount?: number,
  ): Promise<models.PagedResultDto1VoloAbpIdentityIdentityRoleDto | undefined> {
    const axiosResponse = await this.client.get<
      AxiosResponse<models.PagedResultDto1VoloAbpIdentityIdentityRoleDto>
    >('/api/identity/roles', {
      params: { filter, maxResultCount, skipCount, sorting },
    });
    if (axiosResponse?.data) {
      return axiosResponse.data;
    }
    return undefined;
  }

  /**
   * 更新角色
   * @param id 角色ID
   * @param model 角色更新DTO模型，包含要更新的角色信息
   * @returns 返回一个Promise，解析为角色详情或undefined
   */
  public async role_updateRole(
    id: string,
    model: models.VoloAbpIdentityIdentityRoleUpdateDto,
  ): Promise<models.VoloAbpIdentityIdentityRoleDto | undefined> {
    const axiosResponse = await this.client.put<
      AxiosResponse<models.VoloAbpIdentityIdentityRoleDto>
    >(`/api/identity/roles/${id}`, model);
    if (axiosResponse?.data) {
      return axiosResponse.data;
    }
    return undefined;
  }
}
