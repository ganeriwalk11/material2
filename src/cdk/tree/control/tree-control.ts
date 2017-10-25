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

/**
 * Tree control interface. User can implement TreeControl to expand/collapse nodes in the tree.
 * The CDKTree will use this TreeControl to expand/collapse a node.
 * User can also use it outside the `<cdk-tree>` to control the expansion status of the tree.
 */
export interface TreeControl<T> {
  /** The saved tree nodes data for `expandAll` action. */
  nodes: T[];

  /** The expansion change event */
  expandChange: BehaviorSubject<T[]>;

  /** The expansion model */
  expansionModel: SelectionModel<T>;

  /** Whether the node is expanded or collapsed. Return true if it's expanded. */
  expanded(node: T): boolean;

  /** Get all descendents of a node */
  getDescendents(node: T): any[];

  /** Expand or collapse node */
  toggle(node: T);

  /** Expand one node */
  expand(node: T);

  /** Collapse one node */
  collapse(node: T);

  /** Expand all the nodes in the tree */
  expandAll();

  /** Collapse all the nodes in the tree */
  collapseAll();

  /** Toggle a node by expand/collapse it and all its descendents */
  toggleDescendents(node: T);

  /** Expand a node and all its descendents */
  expandDescendents(node: T);

  /** Collapse a ndoe and all its descendents */
  collapseDescendents(node: T);

  /** Get depth of a given node, return the level number. This is for flat tree node. */
  readonly getLevel: (node: T) => number;

  /** Whether the node is expandable. Returns true if expandable. This is for flat tree node. */
  readonly isExpandable: (node: T) => boolean;

  /** Returns an observable for a given node's children. This is for nested tree node. */
  readonly getChildren: (node: T) => Observable<T[]>;
}
