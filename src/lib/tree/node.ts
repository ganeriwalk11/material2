/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  Input,
  ContentChildren,
  QueryList,
  ViewEncapsulation
} from '@angular/core';
import {
  CdkNestedTreeNode,
  CdkNodeDef,
  NodeOutlet,
  CdkTreeNode,
  // FlatNode,
  // NestedNode
} from '@angular/cdk/tree';


/** Workaround for https://github.com/angular/angular/issues/17849 */
export const _MatTreeNode = CdkTreeNode;
export const _MatNodeDef = CdkNodeDef;
export const _MatNestedTreeNode = CdkNestedTreeNode;
export const _MatNodeOutlet = NodeOutlet;

/**
 * Wrapper for the CdkTree node with Material design styles.
 */
@Component({
  moduleId: module.id,
  selector: 'mat-tree-node',
  exportAs: 'matTreeNode',
  template: `<ng-content></ng-content>`,
  host: {
    '[attr.role]': 'role',
    'class': 'mat-tree-node',
    'tabindex': '0',
  },
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: CdkTreeNode, useExisting: MatTreeNode}]
})
export class MatTreeNode<T/* extends FlatNode|NestedNode*/> extends _MatTreeNode<T> {
  @Input('matTreeNode') data: T;
  @Input() role: 'treeitem' | 'group' = 'treeitem';
}

/**
 * Wrapper for the CdkTree node definition with Material design styles.
 */
@Directive({
  selector: '[matNodeDef]',
  inputs: [
    'when: matNodeDefWhen'
  ],
  providers: [{provide: CdkNodeDef, useExisting: MatNodeDef}]
})
export class MatNodeDef<T/* extends FlatNode|NestedNode*/> extends _MatNodeDef<T> {
  @Input('matNode') data: T;
}

/**
 * Wrapper for the CdkTree nested node with Material design styles.
 */
@Directive({
  selector: '[matNestedTreeNode]',
  host: {
    'class': 'mat-nested-tree-node',
  },
  providers: [{provide: CdkNestedTreeNode, useExisting: MatNestedTreeNode}]
})
export class MatNestedTreeNode<T/* extends NestedNode*/> extends _MatNestedTreeNode<T> {
  @Input('matNestedTreeNode') node: T;
}
