export interface GtPageModel<dataModel> {
  data: dataModel[];
  pageIndex: number;
  pageSize: number;
  total: number;
}
