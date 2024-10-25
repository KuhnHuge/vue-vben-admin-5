import type { Dayjs } from 'dayjs';

import type { Component } from 'vue';
import { markRaw } from 'vue';

import { DatePicker, Input, InputNumber, RangePicker } from 'ant-design-vue';

export class FilterValueType {
  private _selectOperation:
    | 'between'
    | 'eq'
    | 'gt'
    | 'gte'
    | 'like'
    | 'lt'
    | 'lte'
    | 'neq' = 'like';
  public bindObject?: object = {};
  public component?: Component;
  public componentCode: number = 0;
  public filterEnable = false;
  public filterOperations?: (
    | 'between'
    | 'eq'
    | 'gt'
    | 'gte'
    | 'like'
    | 'lt'
    | 'lte'
    | 'neq'
  )[];
  public filterType: 'date' | 'number' | 'text' = 'text';
  public specialComponent?: Component;
  public values: Dayjs[] | number[] | string[] | undefined[] = [0, 0];
  constructor(
    filterType: FilterValueType['filterType'],
    selectOperations?: FilterValueType['_selectOperation'],
    filterEnable?: boolean,
    defaultValue?: FilterValueType['values'],
  ) {
    this.filterType = filterType;
    if (defaultValue) {
      this.values = defaultValue;
    }
    if (selectOperations) {
      this._selectOperation = selectOperations;
    }
    if (filterEnable === true) {
      this.filterEnable = true;
    }
    if (
      this.filterOperations &&
      this.filterOperations.length > 0 &&
      !this.filterOperations.includes(this._selectOperation)
    ) {
      this.selectOperation = this.filterOperations[0] ?? 'eq';
    }
    this.updateComponent();
  }

  private updateComponent() {
    switch (this.filterType) {
      case 'date': {
        this.component = markRaw(DatePicker);
        this.specialComponent = markRaw(RangePicker);
        if (this._selectOperation === 'between') {
          this.componentCode = 4;
          break;
        }
        this.componentCode = 1;
        break;
      }
      case 'number': {
        this.component = markRaw(InputNumber);
        this.componentCode = this._selectOperation === 'between' ? 1 | 2 : 1;
        break;
      }
      case 'text': {
        this.component = markRaw(Input);
        this.componentCode = 1;
        break;
      }
      default: {
        break;
      }
    }
  }

  get selectOperation(): FilterValueType['_selectOperation'] {
    return this._selectOperation;
  }

  set selectOperation(value: FilterValueType['_selectOperation']) {
    this._selectOperation = value;
    if (!this.values) {
      this.values = [undefined, undefined];
    }
    this.updateComponent();
  }
}
export function getFilterOperations(
  type: FilterValueType['filterType'],
  operations?: FilterValueType['filterOperations'],
): FilterValueType['filterOperations'] {
  switch (type) {
    case 'date': {
      if (!operations || operations.length === 0) {
        return ['between', 'eq', 'gt', 'gte', 'lt', 'lte'];
      }
      return operations?.filter((operation) =>
        ['between', 'eq', 'gt', 'gte', 'lt', 'lte'].includes(operation),
      );
    }
    case 'number': {
      if (!operations || operations.length === 0) {
        return ['between', 'eq', 'gt', 'gte', 'lt', 'lte'];
      }
      return operations?.filter((operation) =>
        ['between', 'eq', 'gt', 'gte', 'lt', 'lte'].includes(operation),
      );
    }
    case 'text': {
      return ['eq', 'like'];
    }
    default: {
      return [];
    }
  }
}

export interface FilterItem {
  column: string;
  operation: string;
  values: number[] | string[];
}
