/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Returns an error to be thrown when there are multiple nodes that are missing a when function.
 * @docs-private
 */
export function getTreeMultipleDefaultNodeDefsError() {
  return Error(`cdk-tree: There can only be one default row without a when predicate function.`);
}

/**
 * Returns an error to be thrown when there are no matching node defs for a particular set of data.
 * @docs-private
 */
export function getTreeMissingMatchingNodeDefError() {
  return Error(`cdk-tree: Could not find a matching node definition for the provided node data.`);
}

/**
 * Returns an error to be thrown when there are tree control.
 * @docs-private
 */
export function getTreeControlMissingError() {
  return Error(`cdk-tree: Could not find a tree control for the tree.`);
}

/**
 * Returns an error to be thrown when tree control did not implement functions for flat/nested node.
 * @docs-private
 */
export function getTreeControlFunctionsMissingError() {
  return Error(`cdk-tree: Could not find functions for nested/flat tree in tree control.`);
}
