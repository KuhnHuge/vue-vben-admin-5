import type { FilterItem } from '#/components/TbColumnType';

export interface GtGetPageInput {
  commonFilters?: FilterItem[];
  orderBy?: string;
  pageIndex: number;
  pageSize: number;
}
