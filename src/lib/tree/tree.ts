/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ChangeDetectionStrategy, Component, ViewChild, ViewEncapsulation} from '@angular/core';
import {CdkTree} from '@angular/cdk/tree';
import {MatTreeNodeOutlet} from './outlet';

/** Workaround for https://github.com/angular/angular/issues/17849 */
export const _MatTree = CdkTree;

/**
 * Wrapper for the CdkTable with Material design styles.
 */
@Component({
  moduleId: module.id,
  selector: 'mat-tree',
  exportAs: 'matTree',
  template: `<ng-container matTreeNodeOutlet></ng-container>`,
  host: {
    'class': 'mat-tree',
    'role': 'tree',
    '(focus)': 'focus()',
    '(keydown)': 'handleKeydown($event)'
  },
  styleUrls: ['tree.css'],
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: CdkTree, useExisting: MatTree}]
})
export class MatTree<T> extends _MatTree<T> {
  // Outlets within the tree's template where the dataNodes will be inserted.
  @ViewChild(MatTreeNodeOutlet) _nodeOutlet: MatTreeNodeOutlet;
}

