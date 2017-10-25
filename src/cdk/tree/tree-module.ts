/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {FocusMonitor} from '@angular/cdk/a11y';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NodeOutlet} from './outlet';
import {CdkNodePadding} from './padding';
import {CdkNodeTrigger} from './trigger';
import {CdkTree} from './tree';
import {CdkNodeDef, CdkTreeNode} from './node';
import {CdkNestedTreeNode} from './nested-node';

const EXPORTED_DECLARATIONS = [
  CdkNestedTreeNode,
  CdkNodeDef,
  CdkNodePadding,
  CdkNodeTrigger,
  CdkTree,
  CdkTreeNode,
  NodeOutlet,
];

@NgModule({
  imports: [CommonModule],
  exports: EXPORTED_DECLARATIONS,
  declarations: EXPORTED_DECLARATIONS,
  providers: [FocusMonitor]
})
export class CdkTreeModule {}
