import { Component, OnInit } from '@angular/core';
import { Settings, DataTable } from 'ng-mazdik-lib';
import { getColumnsPlayers } from './columns';

@Component({
  selector: 'app-row-group-demo',
  template: `
    <app-data-table [table]="table">
      <ng-template dtRowGroupTemplate let-row="row">
        <div class="datatable-body-cell dt-sticky" style="left: 0;" (click)="onExpand(row)">
          <i [class]="getExpanderIcon(row)"></i>
          {{table.rowGroup.getRowGroupName(row)}} ({{table.rowGroup.getRowGroupSize(row)}})
        </div>
      </ng-template>
    </app-data-table>
  `
})

export class RowGroupDemoComponent implements OnInit {

  table: DataTable;

  settings: Settings = new Settings({
    groupRowsBy: ['race'],
    rowHeightProp: '$$height',
  });

  constructor() {
    const columns = getColumnsPlayers();
    columns.find(x => x.name === 'race').tableHidden = true;
    this.table = new DataTable(columns, this.settings);
    this.table.pager.perPage = 50;
  }

  ngOnInit(): void {
    this.table.events.onLoading(true);
    fetch('assets/players.json').then(res => res.json()).then(data => {
      data.forEach(x => x.expanded = true);
      this.table.rows = data;
      this.table.events.onLoading(false);
    });
  }

  onExpand(row: any): void {
    row.expanded = !row.expanded;
    if (!row.expanded) {
      const descendants = this.table.rowGroup.getGroupRows(row, this.table.rows);
      descendants.forEach(x => x.$$height = 0);
    } else {
      const descendants = this.table.rowGroup.getGroupRows(row, this.table.rows);
      descendants.forEach(x => x.$$height = null);
    }
  }

  getExpanderIcon(row: any): string {
    return (!row.expanded) ? 'dt-icon-node dt-icon-collapsed' : 'dt-icon-node';
  }

}
