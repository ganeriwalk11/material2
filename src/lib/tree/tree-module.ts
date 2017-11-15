/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {NgModule} from '@angular/core';
import {MatTree} from './tree';
import {CdkTreeModule} from '@angular/cdk/tree';
import {MatNestedTreeNode, MatTreeNodeDef, MatTreeNode} from './node';
import {MatTreeNodeTrigger} from './trigger';
import {MatTreeNodePadding} from './padding';
import {CommonModule} from '@angular/common';
import {MatCommonModule} from '@angular/material/core';

@NgModule({
  imports: [CdkTreeModule, CommonModule, MatCommonModule],
  exports: [MatTree, MatTreeNode, MatTreeNodeDef, MatNestedTreeNode,
      MatTreeNodePadding, MatTreeNodeTrigger],
  declarations: [MatTree, MatTreeNode, MatTreeNodeDef, MatNestedTreeNode,
      MatTreeNodePadding, MatTreeNodeTrigger],
})
export class MatTreeModule {}
