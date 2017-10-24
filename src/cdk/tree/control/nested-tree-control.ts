/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {NestedNode} from '../tree-data';
import {BaseTreeControl} from './base-tree-control';

/** Nested tree control. Able to expand/collapse a subtree recursively for NestedNode type. */
export class NestedTreeControl<T extends NestedNode> extends BaseTreeControl<T> {
  /**
   * Expands all nodes in the tree.
   *
   * To make this working, the `nodes` of the TreeControl must be set correctly.
   */
  expandAll() {
    this.expansionModel.clear();
    this.nodes.forEach((node) => this._expandDescendents(node));
    this.expandChange.next(this.expansionModel.selected);
  }

  /** Gets a list of decedent nodes of a subtree rooted at given `node` recursively. */
  getDescendents(node: T): T[] {
    const decedents = [];
    this._getDescendents(decedents, node);
    return decedents;
  }


  /** Expands a subtree rooted at given `node` recursively. */
  expandDescendents(node: T) {
    console.log(`expand nested node ${node} recursively`)
    this._expandDescendents(node);
    console.log(`selected ${this.expansionModel.selected}`)
    this.expandChange.next(this.expansionModel.selected);
  }

  /** Collapses a subtree rooted at given `node` recursively. */
  collapseDescendents(node: T) {
    this.expansionModel.deselect(node);
    const subscription = node.getChildren().subscribe(children => {
      if (children) {
        children.forEach((child: T) => this.collapseDescendents(child));
      }
    });
    subscription.unsubscribe();
    this.expandChange.next(this.expansionModel.selected);
  }

  /** Expands a subtree rooted at given `node` recursively without notification. */
  protected _expandDescendents(node: T) {
    this.expansionModel.select(node);
    const subscription = node.getChildren().subscribe(children => {
      if (children) {
        children.forEach((child: T) => {this.expandDescendents(child); console.log(`get result`)});
      }
    });
    subscription.unsubscribe();
  }

  /** A helper function to get decedents recursively. */
  protected _getDescendents(decedents: T[], node: T) {
    decedents.push(node);
    const subscription = node.getChildren().subscribe(children => {
      if (children) {
        children.forEach((child: T) => this._getDescendents(decedents, child));
      }
    });
    subscription.unsubscribe();
    this.expandChange.next(this.expansionModel.selected);
  }
}
