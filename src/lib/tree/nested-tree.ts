import {Component, ChangeDetectionStrategy, ChangeDetectorRef, Input, OnInit, AfterViewInit, OnDestroy, ViewChild} from '@angular/core';
import {JsonNestedDataSource,JsonNestedNode} from './nested-data-source';
import { JsonNode} from './shared-data-source';
import {SelectionModel} from '@angular/cdk/collections';
import {TreeControl, NestedTreeControl, CdkTree} from '@angular/cdk/tree';
import {Subscription} from 'rxjs/Subscription';

@Component({
  moduleId: module.id,
  selector: 'mat-nested-tree',
  templateUrl: 'nested-tree.html',
  styleUrls: ['nested-tree.css'],
  providers: [{provide: CdkTree, useExisting: MatNestedTree}],
  //changeDetection: ChangeDetectionStrategy.OnPush // make sure tooltip also works OnPush
})
export class MatNestedTree implements OnInit, OnDestroy, AfterViewInit {
  @Input() data: string;

  _subscription: Subscription;

  selection = new SelectionModel<any>(true, []);

  treeControl: TreeControl;
  dataSource: JsonNestedDataSource;

  @ViewChild(CdkTree) tree: CdkTree;

  constructor(public changeDetectorRef: ChangeDetectorRef) {
    this.treeControl = new NestedTreeControl<JsonNestedNode>();
    this.dataSource = new JsonNestedDataSource(this.treeControl);
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.submit();
    this.treeControl.expandChange.next([]);
    if (this.selection.onChange) {
      this._subscription = this.selection.onChange.subscribe(() => {
        this.changeDetectorRef.markForCheck();
      });
    }

  }

  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

  submit() {
    try {
      let obj = JSON.parse(this.data);
      this.dataSource.data = obj;
    } catch (e) {
      console.log(e);
    }
  }

  selectNode(node: any) {
    this.selection.toggle(node);
    let decedents = this.treeControl.getDecedents(node);
    decedents.forEach((decedent: JsonNestedNode) => {
      this.selection.isSelected(node) ? this.selection.select(decedent) : this.selection.deselect(decedent);
    });
  }

  expandAll() {
    this.treeControl.expandAll();
    this.changeDetectorRef.detectChanges();
  }

  collapseAll() {
    this.treeControl.collapseAll();
    this.changeDetectorRef.detectChanges();
  }

  key: string;
  value: string;
  currentNode: JsonNode;
  addChild() {
    this.dataSource.addChild(this.key, this.value, this.currentNode);
  }

  printNodes() {
    console.log(this.tree.items);
  }
}
