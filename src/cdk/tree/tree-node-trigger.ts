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
  Input,
  Optional,
} from '@angular/core';
import {CdkTree} from './tree';
import {CdkTreeNode} from './tree-node';

/**
 * Node trigger
 */
@Directive({
  selector: '[cdkNodeTrigger]',
  host: {
    '(click)': 'trigger($event)',
  }
})
export class CdkNodeTrigger<T> {
  // @Input('cdkNodeTrigger') node: any;
  @Input('cdkNodeTriggerRecursive') recursive: boolean = false;
  // @Input('cdkNodeTriggerSelection') selection: SelectionModel<T>;

  constructor(@Inject(forwardRef(() => CdkTree)) private tree: CdkTree<T>,
              private treeNode: CdkTreeNode<T>) {
    console.log(`tree ${tree} treeNode ${treeNode}`);
  }

  trigger(_: Event) {
    this.recursive
        ? this.tree.treeControl.toggleDecedents(this.treeNode.data)
        : this.tree.treeControl.toggle(this.treeNode.data);
    this.tree.detectChanges();
    //
    // const selection = this.selection ? this.selection : this.tree.treeControl.expansionModel;
    // console.log(this.tree.treeControl);
    // console.log(selection);
    //
    // selection.toggle(this.node);
    // if (this.recursive) {
    //   this.selectRecursive(this.node, selection.isSelected(this.node));
    // }
  }

  selectRecursive(node: T, select: boolean) {
    const selection =
        this.tree.treeControl.expansionModel;
    const decedents = this.tree.treeControl.getDecedents(node);
    decedents.forEach((child) => {
      select ? selection.select(child) : selection.deselect(child);
    });
  }
}
