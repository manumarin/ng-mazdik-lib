import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { KeyValuePair } from './types';

@Component({
  selector: 'app-row-view',
  templateUrl: './row-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RowViewComponent {

  @Input() transposedData: KeyValuePair[];
  @Input() headerKeyMessage = 'Key';
  @Input() headerValueMessage = 'Value';

  order: string;
  reverse = true;
  private orderedData: KeyValuePair[];

  constructor() { }

  setOrder(name: string): void {
    if (this.order === name) {
      this.reverse = !this.reverse;
    }
    this.order = name;
    this.orderedData = this.orderBy(this.transposedData, this.order, this.reverse);
  }

  isOrder(name: string): boolean {
    return this.order === name && this.reverse;
  }

  isOrderReverse(name: string): boolean {
    return this.order === name && !this.reverse;
  }

  get viewData(): KeyValuePair[] {
    return (this.orderedData) ? this.orderedData : this.transposedData;
  }

  orderBy(array: any[], field: string, reverse?: boolean): any[] {
    if (!array || !field) {
      return array;
    }
    array.sort((a, b) => (a[field] > b[field]) ? 1 : (a[field] < b[field]) ? -1 : 0);
    return (reverse === false) ? array.reverse() : array;
  }

}
