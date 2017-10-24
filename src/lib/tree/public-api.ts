/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {CdkTreeModule} from '@angular/cdk/tree';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatCommonModule} from '@angular/material/core';
import {MatTree} from './tree';
import {MatNestedTreeNode, MatNodeDef, MatTreeNode} from './node';
import {MatNodePadding} from './padding';
import {MatNodeTrigger} from './trigger';

export * from './tree';
export * from './node';
export * from './padding';
export * from './trigger';
export * from './flat-data-source';
export * from './nested-data-source';

const EXPORTED_DECLARATIONS = [
  MatNestedTreeNode,
  MatNodeDef,
  MatNodePadding,
  MatNodeTrigger,
  MatTree,
  MatTreeNode,
];

@NgModule({
  imports: [CdkTreeModule, CommonModule, MatCommonModule],
  exports: EXPORTED_DECLARATIONS,
  declarations: EXPORTED_DECLARATIONS
})
export class MatTreeModule {}
