/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Directionality} from '@angular/cdk/bidi';
import {Directive, Input, Optional} from '@angular/core';
import {CdkTreeNode} from './node';
import {FlatNode} from './tree-data';

/**
 * Indent for the children tree nodes.
 * This directive will add left-padding to the node to show hierarchy.
 */
@Directive({
  selector: '[cdkNodePadding]',
  host: {
    '[style.padding-left]': 'paddingIndentLeft()',
    '[style.padding-right]': 'paddingIndentRight()',
  }
})
export class CdkNodePadding<T extends FlatNode> {
  /** The level of depth of the tree node. The padding will be `level * indent` pixels. */
  @Input('cdkNodePadding') level: number;

  /** The indent for each level. */
  @Input('cdkNodePaddingIndent') indent: number = 28;

  /** The padding indent value for the tree node. Returns a string with px numbers if not null. */
  _paddingIndent() {
    const nodeLevel = (this._treeNode.data && this._treeNode.data.getLevel())
      ? this._treeNode.data.getLevel()
      : null;
    const level = this.level || nodeLevel;
    return level ? `${level * this.indent}px` : null;
  }

  /** The left padding indent value for the tree node. */
  paddingIndentLeft() {
    return this._dir.value === 'rtl' ? null : this._paddingIndent();
  }

  /** The right padding indent value for the tree node. */
  paddingIndentRight() {
    return this._dir.value === 'rtl' ? this._paddingIndent() : null;
  }

  constructor(private _treeNode: CdkTreeNode<T>, @Optional() private _dir: Directionality) {}
}
