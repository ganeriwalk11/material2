/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {CdkTree} from './tree';
import {CdkNodePadding} from './tree-node-padding';
import {CdkNodePlaceholder} from './tree-node-placeholder';
import {CdkNode, CdkNodeDef} from './tree-node';
import {CdkNodeTrigger} from './tree-node-trigger';
import {CdkNestedNode} from './tree-nested-node';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FocusMonitor} from '@angular/cdk/a11y';


export * from './tree';
export * from './tree-control';
export * from './tree-node-data';
export * from './tree-node';
export * from './tree-node-placeholder';
export * from './tree-node-padding';
export * from './tree-node-trigger';

let treeComponents = [
  CdkTree,
  CdkNodeDef,
  CdkNode,
  CdkNodePlaceholder,
  CdkNodeTrigger,
  CdkNodePadding,
  CdkNestedNode
];

@NgModule({
  imports: [CommonModule],
  exports: treeComponents,
  declarations: treeComponents,
  providers: [FocusMonitor]
})
export class CdkTreeModule {}
