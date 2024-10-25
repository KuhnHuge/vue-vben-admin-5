import type { FilterItem } from '#/components/TbColumnType';

export interface GtGetPageInput {
  commonFilters?: FilterItem[];
  pageIndex: number;
  pageSize: number;
}
