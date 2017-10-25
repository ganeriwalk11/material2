/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {SelectionModel} from '@angular/cdk/collections';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {TreeControl} from './tree-control';

/** Base tree control. It has basic toggle/expand/collapse operations on a single node. */
export abstract class BaseTreeControl<T> implements TreeControl<T> {
  /** Saved node for `expandAll` action. */
  nodes: T[];

  /** Expansion info: the changes */
  expandChange = new BehaviorSubject<T[]>([]);

  /** A selection model with multi-selection to track expansion status. */
  expansionModel: SelectionModel<T> = new SelectionModel<T>(true);

  /** Toggles one single node. Expands a collapsed node or collapse an expanded node. */
  toggle(node: T) {
    this.expansionModel.toggle(node);
    this.expandChange.next(this.expansionModel.selected);
  }

  /** Expands one single node. */
  expand(node: T) {
    this.expansionModel.select(node);
    this.expandChange.next(this.expansionModel.selected);
  }

  /** Collapses one single node. */
  collapse(node: T) {
    this.expansionModel.deselect(node);
    this.expandChange.next(this.expansionModel.selected);
  }

  /** Whether a given node is expanded or not. Returns true if the node is expanded. */
  expanded(node: T) {
    return this.expansionModel.isSelected(node);
  }

  /** Toggles a subtree rooted at `node` recursively. */
  toggleDescendents(node: T) {
    this.expansionModel.toggle(node);
    const expand = this.expansionModel.isSelected(node);
    expand ? this.expandDescendents(node) : this.collapseDescendents(node);
  }

  /** Collapse all nodes in the tree. */
  collapseAll() {
    this.expansionModel.clear();
    this.expandChange.next(this.expansionModel.selected);
  }

  /** Expands all nodes in the tree. */
  abstract expandAll();

  /** Expands a subtree rooted at given `node` recursively. */
  abstract expandDescendents(node: T);

  /** Collapses a subtree rooted at given `node` recursively. */
  abstract collapseDescendents(node: T);

  /** Gets a list of descendent nodes of a subtree rooted at given `node` recursively. */
  abstract getDescendents(node: T): T[];

  /** Get depth of a given node, return the level number. This is for flat tree node. */
  getLevel: (node: T) => number;

  /** Whether the node is expandable. Returns true if expandable. This is for flat tree node. */
  isExpandable: (node: T) => boolean;

  /** Returns an observable for a given node's children. This is for nested tree node. */
  getChildren: (node: T) => Observable<T[]>;
}
