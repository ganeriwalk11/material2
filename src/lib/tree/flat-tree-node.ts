// import {OnInit, Component, ChangeDetectionStrategy, AfterViewInit, OnDestroy, ChangeDetectorRef, Directive, Input, ViewChildren, ViewChild, QueryList, TemplateRef} from '@angular/core';
// import {JsonDataSource, JsonFlatNode} from './flat-data-source'
// import {CdkNodePlaceholder,  CdkTree, TreeControl, FlatTreeControl} from '@angular/cdk/tree';
// import {DataSource, SelectionModel} from '@angular/cdk/collections';
// import {Subscription} from 'rxjs/Subscription';
//
//
// @Component({
//   moduleId: module.id,
//   selector: 'mat-tree-node',
//   templateUrl: 'flat-tree-node.html',
//   styleUrls: ['flat-tree-node.css'],
//   changeDetection: ChangeDetectionStrategy.OnPush // make sure tooltip also works OnPush
// })
// export class MatTreeNode implements OnDestroy, AfterViewInit {
//   _selectSubscription: Subscription;
//   @Input() node: any;
//   @Input() selection: SelectionModel<any>;
//   constructor(public tree: CdkTree, public changeDetectorRef: ChangeDetectorRef) {}
//
//   get selected() { return this.selection.isSelected(this.node); }
//   get dataSource(): DataSource<any> { return this.tree.dataSource; }
//   get treeControl(): TreeControl { return this.tree.treeControl; }
//
//   ngAfterViewInit() {
//     // if (this.selection.onChange) {
//     //   this._selectSubscription = this.selection.onChange.subscribe(() => {
//     //     this.changeDetectorRef.markForCheck();
//     //   });
//     // }
//
//   }
//
//   ngOnDestroy() {
//     this._selectSubscription.unsubscribe();
//   }
//
//   createArray(level: number) {
//     return new Array(level);
//   }
//
//   selectNode(node: any, _: any) {
//     this.selection.toggle(node);
//     let decedents = this.treeControl.getDecedents(node);
//     decedents.forEach((decedent: JsonFlatNode) => {
//       this.selected ? this.selection.select(decedent) : this.selection.deselect(decedent);
//     });
//     this.changeDetectorRef.markForCheck();
//   }
// }


import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {CDK_TREE_NODE_TEMPLATE, CdkTreeNode} from '@angular/cdk/tree';

/** Workaround for https://github.com/angular/angular/issues/17849 */
export const _MatTreeNode = CdkTreeNode;

/**
 * Wrapper for the CdkTable with Material design styles.
 */
@Component({
  moduleId: module.id,
  selector: 'mat-tree-node',
  exportAs: 'matTreeNode',
  template: CDK_TREE_NODE_TEMPLATE,
  host: {
    'class': 'mat-tree-node',
  },
  inputs: ['cdkNode', 'role'],
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: CdkTreeNode, useExisting: MatTreeNode}]
})
export class MatTreeNode<T> extends _MatTreeNode<T> { }
