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
  ViewEncapsulation
} from '@angular/core';
import {
  CDK_TREE_NODE_TEMPLATE,
  CdkNestedNode,
  CdkNodeDef,
  CdkNodePlaceholder,
  CdkTreeNode,
  FlatNode,
  NestedNode
} from '@angular/cdk/tree';


/** Workaround for https://github.com/angular/angular/issues/17849 */
export const _MatTreeNode = CdkTreeNode;
export const _MatNodeDef = CdkNodeDef;
export const _MatNestedNode = CdkNestedNode;
export const _MatNodePlaceholder = CdkNodePlaceholder;

/**
 * Wrapper for the CdkTree node with Material design styles.
 */
@Component({
  moduleId: module.id,
  selector: 'mat-tree-node',
  exportAs: 'matTreeNode',
  template: CDK_TREE_NODE_TEMPLATE,
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
export class MatTreeNode<T extends FlatNode|NestedNode> extends _MatTreeNode<T> {
  @Input('matNode') data: T;
  @Input() role: string = 'treeitem';
}

/**
 * Wrapper for the CdkTree node definition with Material design styles.
 */
@Directive({
  selector: '[matNodeDef]',
  inputs: ['when: matNodeDefWhen'],
  providers: [{provide: CdkNodeDef, useExisting: MatNodeDef}]
})
export class MatNodeDef<T extends FlatNode|NestedNode> extends _MatNodeDef<T> {
  @Input('matNode') data: T;
}

/**
 * Wrapper for the CdkTree nested node with Material design styles.
 */
@Directive({
  selector: '[matNestedNode]',
  host: {
    'class': 'mat-nested-node',
  },
  providers: [{provide: CdkNestedNode, useExisting: MatNestedNode}]
})
export class MatNestedNode<T extends NestedNode> extends _MatNestedNode<T> {
  @Input('matNestedNode') node: T;
}

/**
 * Wrapper for the CdkTree node placeholder with Material design styles.
 */
@Directive({
  selector: '[matNodePlaceholder]',
  providers: [{provide: CdkNodePlaceholder, useExisting: MatNodePlaceholder}]
})
export class MatNodePlaceholder extends _MatNodePlaceholder { }
