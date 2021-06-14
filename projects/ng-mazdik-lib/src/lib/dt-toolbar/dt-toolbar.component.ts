import { DropdownService } from './../dropdown/dropdown.service';
import {
  Component, Input, Output, EventEmitter, HostBinding, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { DataTable, Row, Column } from '../ng-data-table/base';
import { Subscription } from 'rxjs';
import { downloadCSV, Keys } from '../common';

@Component({
  selector: 'dt-toolbar',
  templateUrl: './dt-toolbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtToolbarComponent implements OnInit, OnDestroy {

  @Input() table: DataTable;
  @Input() createAction: boolean;
  @Input() globalFilter = true;
  @Input() exportAction: boolean;
  @Input() columnToggleAction: boolean;
  @Input() clearAllFiltersAction: boolean;

  @Output() create: EventEmitter<any> = new EventEmitter();

  @HostBinding('class.dt-toolbar') cssClass = true;

  private subscriptions: Subscription[] = [];

  constructor(private cd: ChangeDetectorRef, private dropdownService: DropdownService) {}

  ngOnInit(): void  {
    const subFilter = this.table.events.filterSource$.subscribe(() => {
      this.cd.markForCheck();
    });
    this.subscriptions.push(subFilter);
  }

  ngOnDestroy(): void  {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onClickGlobalSearch(): void  {
    this.table.events.onFilter();
  }

  onInputGlobalSearch(event: Event): void {
    const element = event.target as HTMLInputElement;
    this.table.dataFilter.globalFilterValue = element.value;
  }

  onKeyPressGlobalSearch(event: KeyboardEvent): void  {
    if (event.which === Keys.ENTER) {
      this.table.events.onFilter();
    }
  }

  downloadCsv(): void  {
    const keys = this.table.columns.map(col => col.name);
    const titles = this.table.columns.map(col => col.title);

    const resultRows = [];
    this.table.rows.forEach((x: Row) => {
      const row = x.clone();
      this.table.columns.forEach((col: Column) => {
        row[col.name] = col.getValueView(row);
      });
      resultRows.push(row);
    });

    downloadCSV({rows: resultRows, keys, titles});
  }

  createActionClick(): void  {
    this.create.emit();
  }

  clearAllFilters(): void  {
    if (this.table.dataFilter.hasFilters()) {
      this.table.dataFilter.clear();
      this.table.events.onFilter();
    }
  }
  changeModeList(){
    this.dropdownService.prueba ? this.dropdownService.prueba=false : this.dropdownService.prueba=true;
  }

}
