import dayjs, { Dayjs } from 'dayjs';

import { type FilterItem, FilterValueType } from '#/components/TbColumnType';

export class FilterChangeHandler {
  private _currentFilterItems: FilterItem[] = [];
  private _currentMd5: string;
  private _filterValue: object;
  private _nextFilterItems: FilterItem[] = [];
  private _nextMd5: string = '';

  constructor(filterValue: object) {
    this._filterValue = filterValue;
    this._currentMd5 = this.getMd5();
    this._currentFilterItems = this._nextFilterItems;
  }

  private getMd5() {
    try {
      const filterItems: FilterItem[] = [];
      Object.keys(this._filterValue).forEach((key) => {
        const v = this._filterValue[
          key as keyof typeof this._filterValue
        ] as FilterValueType;
        if (!v.filterEnable) return;
        const values =
          Array.isArray(v.values) &&
          v.values.length > 0 &&
          v.values[0] instanceof dayjs
            ? v.values.map((v) => (v as Dayjs)?.format('YYYY-MM-DD HH:mm:ss'))
            : (v.values as any[]);
        if (v.selectOperation !== 'between' && values?.length >= 2) {
          values[1] = null;
        }
        filterItems.push({
          column: key,
          operation: v.selectOperation,
          values,
        });
      });
      this._nextFilterItems = filterItems;
      return JSON.stringify(filterItems);
      // return CryptoJS.MD5(s).toString();
      // return s;
    } catch (error) {
      console.error(error);
      return '';
    }
  }

  public apply() {
    this._currentMd5 = this._nextMd5;
    this._currentFilterItems = this._nextFilterItems;
  }
  public getFilterItems() {
    return this._currentFilterItems;
  }

  public isFilterChanged() {
    return this._currentMd5 !== this._nextMd5;
  }

  public setNextFilterValue(filterValue: object) {
    this._filterValue = filterValue;
    this._nextMd5 = this.getMd5();
  }
}
