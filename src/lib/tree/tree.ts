// import {Component, ChangeDetectionStrategy, ChangeDetectorRef, Input, OnInit, AfterViewInit, ViewChild} from '@angular/core';
// import {JsonDataSource, JsonFlatNode} from './flat-data-source';
// import { JsonNode} from './shared-data-source';
// import {SelectionModel} from '@angular/cdk/collections';
// import {CdkTree, CDK_TREE_TEMPLATE, TreeControl, FlatTreeControl} from '@angular/cdk/tree';
// import {Subscription} from 'rxjs/Subscription';
//
// @Component({
//   moduleId: module.id,
//   selector: 'mat-flat-tree',
//   templateUrl: 'flat-tree.html',
//   styleUrls: ['flat-tree.css'],
//   providers: [{provide: CdkTree, useExisting: MatFlatTree}],
//   changeDetection: ChangeDetectionStrategy.OnPush // make sure tooltip also works OnPush
// })
// export class MatFlatTree implements OnInit, AfterViewInit {
//
//   @Input() data: string;
//
//   selection = new SelectionModel<any>(true, []);
//
//
//   @ViewChild(CdkTree) tree: CdkTree;
//
//   treeControl: TreeControl;
//
//   dataSource: JsonDataSource;
//
//   _selectSubscription: Subscription;
//
//
//   constructor(public changeDetectorRef: ChangeDetectorRef) {
//     this.treeControl = new FlatTreeControl<JsonFlatNode>();
//     this.dataSource = new JsonDataSource(this.treeControl as FlatTreeControl<JsonFlatNode>);
//   }
//
//   ngOnInit() {
//
//   }
//
//   ngAfterViewInit() {
//     this.submit();
//     this.treeControl.expandChange.next([]);
//     this.changeDetectorRef.markForCheck();
//     if (this.selection.onChange) {
//       this._selectSubscription = this.selection.onChange.subscribe(() => {
//         this.changeDetectorRef.markForCheck();
//       });
//     }
//   }
//
//   ngOnDestroy() {
//     this._selectSubscription.unsubscribe();
//   }
//
//   submit() {
//     try {
//       console.log(this.data);
//       let obj = JSON.parse(this.data);
//       this.dataSource.data = obj;
//     } catch (e) {
//       console.log(e);
//     }
//   }
//
//   key: string;
//   value: string;
//   currentNode: JsonNode;
//   addChild() {
//     console.log(this.currentNode);
//     this.dataSource.addChild(this.key, this.value, this.currentNode);
//   }
//
//
//   createArray(level: number) {
//     return new Array(level);
//   }
//
//   selectNode(node: any, _: any) {
//     this.selection.toggle(node);
//     let decedents = this.treeControl.getDecedents(node);
//     let selected = this.selection.isSelected(node);
//     decedents.forEach((decedent: JsonFlatNode) => {
//       selected ? this.selection.select(decedent) : this.selection.deselect(decedent);
//     });
//     this.changeDetectorRef.markForCheck();
//   }
//
//
//   expandAll() {
//     this.treeControl.expandAll();
//     this.changeDetectorRef.detectChanges();
//   }
//
//   collapseAll() {
//     this.treeControl.collapseAll();
//     this.changeDetectorRef.detectChanges();
//   }
// }
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {CDK_TREE_TEMPLATE, CdkTree, FlatNode, NestedNode} from '@angular/cdk/tree';

/** The template for CDK tree */
export const MAT_TREE_TEMPLATE = `<ng-container matNodePlaceholder></ng-container>`;
/** Workaround for https://github.com/angular/angular/issues/17849 */
export const _MatTree = CdkTree;

/**
 * Wrapper for the CdkTable with Material design styles.
 */
@Component({
  moduleId: module.id,
  selector: 'mat-tree',
  exportAs: 'matTree',
  template: MAT_TREE_TEMPLATE,
  host: {
    'class': 'mat-tree',
  },
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: CdkTree, useExisting: MatTree}]
})
export class MatTree<T extends FlatNode|NestedNode> extends _MatTree<T> { }
