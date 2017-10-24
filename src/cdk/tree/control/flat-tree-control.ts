/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {FlatNode} from '../tree-data';
import {BaseTreeControl} from './base-tree-control';

/** Flat tree control. Able to expand/collapse a subtree recursively for FlatNode type. */
export class FlatTreeControl<T extends FlatNode> extends BaseTreeControl<T> {
  /**
   * Gets a list of descendent nodes of a subtree rooted at given `node` recursively.
   *
   * To make this working, the `nodes` of the TreeControl must be set correctly.
   */
  getDescendents(node: T) {
    const startIndex = this.nodes.indexOf(node);
    const results: T[] = [];
    let i = startIndex + 1;
    console.log(this.nodes[i]);
    for (;i < this.nodes.length && node.getLevel() < this.nodes[i].getLevel(); i++) {
      results.push(this.nodes[i]);
    }
    return results;
  }

  /**
   * Expands all nodes in the tree.
   *
   * To make this working, the `nodes` of the TreeControl must be set correctly.
   */
  expandAll() {
    this.expansionModel.clear();
    this.nodes.forEach((node) => node.isExpandable() && this.expansionModel.select(node));
    this.expandChange.next(this.expansionModel.selected);
  }

  /** Expands a subtree rooted at given `node` recursively. */
  expandDescendents(node: T) {
    const descendents = this.getDescendents(node);
    descendents.forEach((child) => child.isExpandable() && this.expansionModel.select(child));
    this.expandChange.next(this.expansionModel.selected);
  }

  /** Collapses a subtree rooted at given `node` recursively. */
  collapseDescendents(node: T) {
    const descendents = this.getDescendents(node);
    descendents.forEach((child) => this.expansionModel.deselect(child));
    this.expandChange.next(this.expansionModel.selected);
  }
}
