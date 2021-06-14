import { Component, OnInit, OnDestroy } from '@angular/core';
import { TreeTable, Settings, TreeBuilder } from 'ng-mazdik-lib';
import { TreeDemoService } from './tree-demo.service';
import { getTreeColumns } from './columns';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tree-table-demo',
  template: `<p>Tree with lazy load child nodes</p>
  <app-tree-table [treeTable]="treeTable"></app-tree-table>
  <p>Build tree array from flat array (id, parentId)</p>
  <app-tree-table [treeTable]="flattenTreeTable"></app-tree-table>
  `
})
export class TreeTableDemoComponent implements OnInit, OnDestroy {

  settings: Settings = new Settings({
    selectionMultiple: true,
    selectionMode: 'checkbox',
    filter: false,
    sortable: false,
  });
  treeTable: TreeTable;
  flattenTreeTable: TreeTable;

  private subscriptions: Subscription[] = [];

  constructor(private treeService: TreeDemoService) {
    const columns = getTreeColumns();
    for (const column of columns) {
      column.editable = false;
    }
    this.treeTable = new TreeTable(columns, this.settings, this.treeService);
    this.treeTable.pager.perPage = 1000;
    this.treeTable.getIconFunc = (node) => (!node.isLeaf()) ? 'dt-icon-folder' : 'dt-icon-file';

    const columns2 = getTreeColumns();
    for (const column of columns) {
      column.editable = false;
    }
    this.flattenTreeTable = new TreeTable(columns2, this.settings, null);
  }

  ngOnInit(): void {
    this.flattenTreeTable.events.onLoading(true);
    fetch('assets/flatten-tree.json').then(res => res.json()).then(data => {
      const nodes = TreeBuilder.rowsToTree(data, 'parentId', 'id');
      this.flattenTreeTable.nodes = nodes;
      this.flattenTreeTable.events.onLoading(false);
    });

    const subSelection = this.treeTable.events.selectionSource$.subscribe(() => {
      console.log(this.treeTable.getSelection());
    });
    this.subscriptions.push(subSelection);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
