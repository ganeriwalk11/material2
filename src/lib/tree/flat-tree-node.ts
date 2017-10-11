import {OnInit, Component, ChangeDetectionStrategy, AfterViewInit, OnDestroy, ChangeDetectorRef, Directive, Input, ViewChildren, ViewChild, QueryList, TemplateRef} from '@angular/core';
import {JsonDataSource, JsonFlatNode} from './flat-data-source'
import {CdkNodePlaceholder,  CdkTree, TreeControl, FlatTreeControl} from '@angular/cdk/tree';
import {DataSource, SelectionModel} from '@angular/cdk/collections';
import {Subscription} from 'rxjs/Subscription';


@Component({
  moduleId: module.id,
  selector: 'mat-flat-tree-node',
  templateUrl: 'flat-tree-node.html',
  styleUrls: ['flat-tree-node.css'],
  changeDetection: ChangeDetectionStrategy.OnPush // make sure tooltip also works OnPush
})
export class MatFlatTreeNode implements OnDestroy, AfterViewInit {
  _selectSubscription: Subscription;
  @Input() node: any;
  @Input() selection: SelectionModel<any>;
  constructor(public tree: CdkTree, public changeDetectorRef: ChangeDetectorRef) {}

  get selected() { return this.selection.isSelected(this.node); }
  get dataSource(): DataSource<any> { return this.tree.dataSource; }
  get treeControl(): TreeControl { return this.tree.treeControl; }

  ngAfterViewInit() {
    // if (this.selection.onChange) {
    //   this._selectSubscription = this.selection.onChange.subscribe(() => {
    //     this.changeDetectorRef.markForCheck();
    //   });
    // }

  }

  ngOnDestroy() {
    this._selectSubscription.unsubscribe();
  }

  createArray(level: number) {
    return new Array(level);
  }

  selectNode(node: any, _: any) {
    this.selection.toggle(node);
    let decedents = this.treeControl.getDecedents(node);
    decedents.forEach((decedent: JsonFlatNode) => {
      this.selected ? this.selection.select(decedent) : this.selection.deselect(decedent);
    });
    this.changeDetectorRef.markForCheck();
  }
}
