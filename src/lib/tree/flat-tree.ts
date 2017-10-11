import {Component, ChangeDetectionStrategy, ChangeDetectorRef, Input, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {JsonDataSource, JsonFlatNode} from './flat-data-source';
import { JsonNode} from './shared-data-source';
import {SelectionModel} from '@angular/cdk/collections';
import {CdkTree, TreeControl, FlatTreeControl} from '@angular/cdk/tree';
import {Subscription} from 'rxjs/Subscription';

@Component({
  moduleId: module.id,
  selector: 'mat-flat-tree',
  templateUrl: 'flat-tree.html',
  styleUrls: ['flat-tree.css'],
  providers: [{provide: CdkTree, useExisting: MatFlatTree}],
  changeDetection: ChangeDetectionStrategy.OnPush // make sure tooltip also works OnPush
})
export class MatFlatTree implements OnInit, AfterViewInit {

  @Input() data: string;

  selection = new SelectionModel<any>(true, []);


  @ViewChild(CdkTree) tree: CdkTree;

  treeControl: TreeControl;

  dataSource: JsonDataSource;

  _selectSubscription: Subscription;


  constructor(public changeDetectorRef: ChangeDetectorRef) {
    this.treeControl = new FlatTreeControl<JsonFlatNode>();
    this.dataSource = new JsonDataSource(this.treeControl as FlatTreeControl<JsonFlatNode>);
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.submit();
    this.treeControl.expandChange.next([]);
    this.changeDetectorRef.markForCheck();
    if (this.selection.onChange) {
      this._selectSubscription = this.selection.onChange.subscribe(() => {
        this.changeDetectorRef.markForCheck();
      });
    }
  }

  ngOnDestroy() {
    this._selectSubscription.unsubscribe();
  }

  submit() {
    try {
      console.log(this.data);
      let obj = JSON.parse(this.data);
      this.dataSource.data = obj;
    } catch (e) {
      console.log(e);
    }
  }

  key: string;
  value: string;
  currentNode: JsonNode;
  addChild() {
    console.log(this.currentNode);
    this.dataSource.addChild(this.key, this.value, this.currentNode);
  }


  createArray(level: number) {
    return new Array(level);
  }

  selectNode(node: any, _: any) {
    this.selection.toggle(node);
    let decedents = this.treeControl.getDecedents(node);
    let selected = this.selection.isSelected(node);
    decedents.forEach((decedent: JsonFlatNode) => {
      selected ? this.selection.select(decedent) : this.selection.deselect(decedent);
    });
    this.changeDetectorRef.markForCheck();
  }


  expandAll() {
    this.treeControl.expandAll();
    this.changeDetectorRef.detectChanges();
  }

  collapseAll() {
    this.treeControl.collapseAll();
    this.changeDetectorRef.detectChanges();
  }
}
