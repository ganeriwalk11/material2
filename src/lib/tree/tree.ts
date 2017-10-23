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
    'role': 'tree',
    '(focus)': 'focus()',
    '(keydown)': 'handleKeydown($event)'
  },
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: CdkTree, useExisting: MatTree}]
})
export class MatTree<T extends FlatNode|NestedNode> extends _MatTree<T> { }
