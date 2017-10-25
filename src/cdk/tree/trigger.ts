/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  Directive,
  forwardRef,
  Inject,
  Input,
} from '@angular/core';
import {CdkTree} from './tree';
import {CdkTreeNode} from './node';

/**
 * Node trigger to expand/collapse the node.
 */
@Directive({
  selector: '[cdkNodeTrigger]',
  host: {
    '(click)': '_trigger()',
  }
})
export class CdkNodeTrigger<T> {
  /** Whether expand/collapse the node recursively. */
  @Input('cdkNodeTriggerRecursive') recursive: boolean = true;

  constructor(@Inject(forwardRef(() => CdkTree)) private _tree: CdkTree<T>,
              private _treeNode: CdkTreeNode<T>) {}

  _trigger() {
    this.recursive
      ? this._tree.treeControl.toggleDescendents(this._treeNode.data)
      : this._tree.treeControl.toggle(this._treeNode.data);
  }
}
