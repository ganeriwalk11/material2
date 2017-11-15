/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  Directive,
  Input,
} from '@angular/core';
import {
  CdkNestedTreeNode,
  CdkTreeNodeDef,
  CdkTreeNode,
} from '@angular/cdk/tree';


/** Workaround for https://github.com/angular/angular/issues/17849 */
export const _MatTreeNode = CdkTreeNode;
export const _MatNodeDef = CdkTreeNodeDef;
export const _MatNestedTreeNode = CdkNestedTreeNode;

/**
 * Wrapper for the CdkTree node with Material design styles.
 */
@Directive({
  selector: 'mat-tree-node',
  exportAs: 'matTreeNode',
  host: {
    '[attr.role]': 'role',
    'class': 'mat-tree-node',
    'tabindex': '0',
  },
  providers: [{provide: CdkTreeNode, useExisting: MatTreeNode}]
})
export class MatTreeNode<T> extends _MatTreeNode<T> {
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
  providers: [{provide: CdkTreeNodeDef, useExisting: MatNodeDef}]
})
export class MatNodeDef<T> extends _MatNodeDef<T> {
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
export class MatNestedTreeNode<T> extends _MatNestedTreeNode<T> {
  @Input('matNestedTreeNode') node: T;
}
