import {
  Component, Input, HostBinding, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy
} from '@angular/core';
import { Column, DataTable, EventHelper } from '../../base';
import { Subscription } from 'rxjs';
import { ColumnMenuEventArgs } from '../../base/types';

@Component({
  selector: 'dt-header-cell',
  templateUrl: 'header-cell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class HeaderCellComponent implements OnInit, OnDestroy {

  @Input() table: DataTable;
  @Input() column: Column;

  @HostBinding('class.datatable-header-cell') cssClass = true;
  @HostBinding('class.dt-sticky') get cssSticky(): boolean {
    return this.column.frozen;
  }

  @HostBinding('attr.role') role = 'columnheader';

  @HostBinding('style.width.px')
  get width(): number {
    return this.column.width;
  }

  @HostBinding('style.min-width.px')
  get minWidth(): number {
    return this.column.minWidth;
  }

  @HostBinding('style.max-width.px')
  get maxWidth(): number {
    return this.column.maxWidth;
  }

  @HostBinding('attr.title')
  get name(): string {
    return this.column.title;
  }

  get direction(): string {
    const order = this.table.sorter.getOrder(this.column.name);
    return (order === -1) ? 'desc' : (order === 1) ? 'asc' : '';
  }

  private subscriptions: Subscription[] = [];

  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    const subFilter = this.table.events.filterSource$.subscribe(() => {
      this.cd.markForCheck();
    });
    const subSort = this.table.events.sortSource$.subscribe(() => {
      this.cd.markForCheck();
    });
    const subSelection = this.table.events.selectionSource$.subscribe(() => {
      this.cd.markForCheck();
    });
    this.subscriptions.push(subFilter);
    this.subscriptions.push(subSort);
    this.subscriptions.push(subSelection);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onSort(): void {
    if (this.column.sortable) {
      this.table.sorter.setOrder(this.column.name);
      this.table.events.onSort();
    }
  }

  clickColumnMenu(event: MouseEvent, column: Column): void {
    const { left, top } = EventHelper.getColumnPosition(event, this.table.dimensions.columnMenuWidth);
    this.table.events.onColumnMenuClick({ left, top, column } as ColumnMenuEventArgs);
  }

  isFiltered(): boolean {
    const field = (this.column.keyColumn) ? this.column.keyColumn : this.column.name;
    return this.table.dataFilter.hasFilter(field);
  }

}
