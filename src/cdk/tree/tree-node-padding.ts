/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Directive, Input} from '@angular/core';
import {CdkNode} from './tree-node';
/**
 * Indent for the children
 */
@Directive({
  selector: '[cdkNodePadding]',
  host: {
    '[style.padding-left]': 'paddingIndent',
  },
})
export class CdkNodePadding {
  @Input('cdkNodePadding') level: number;

  @Input('cdkNodePaddingIndex') indent: number = 28;

  get paddingIndent() {
    let nodeLevel = (this.node.data && this.node.data.level) ? this.node.data.level : null;
    let level = this.level || nodeLevel;
    return level ? `${level * this.indent}px` : '';
  }

  constructor(public node: CdkNode) {}
}
