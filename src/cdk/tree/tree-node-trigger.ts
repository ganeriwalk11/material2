/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {SelectionModel} from '@angular/cdk/collections';
import {
  Directive,
  forwardRef,
  Inject,
  Input
} from '@angular/core';
import {CdkTree} from './tree';

/**
 * Node trigger
 */
@Directive({
  selector: '[cdkNodeTrigger]',
  host: {
    'class': 'mat-node-trigger',
    '(click)': 'trigger($event)',
  }
})
export class CdkNodeTrigger {
  @Input('cdkNodeTrigger') node: any;
  @Input('cdkNodeTriggerRecursive') recursive: boolean = false;
  @Input('cdkNodeTriggerSelection') selection: SelectionModel<any>;

  constructor(@Inject(forwardRef(() => CdkTree)) private tree: CdkTree) {
  }

  trigger(_: Event) {
    this.selection.toggle(this.node);
    if (this.recursive) {
      this.selectRecursive(this.node, this.selection.isSelected(this.node));
    }
  }

  selectRecursive(node: any, select: boolean) {
    let decedents = this.tree.treeControl.getDecedents(node);
    decedents.forEach((child) => {
      select ? this.selection.select(child) : this.selection.deselect(child);
    });
  }
}
