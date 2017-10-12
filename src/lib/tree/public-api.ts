/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {NgModule} from '@angular/core';
import {MatTree} from './flat-tree';
import {MatTreeNode} from './flat-tree-node';
// import {MatNestedTree} from './nested-tree';
// import {MatNestedTreeNode} from './nested-tree-node';
import {MatNodeTrigger, MatNodePadding} from './node-trigger';
import {CdkTreeModule} from '@angular/cdk/tree';
import {CommonModule} from '@angular/common';
import {MatCommonModule} from '@angular/material/core';

export * from './flat-tree';
export * from './flat-tree-node';
export * from './node-trigger';
// export * from './nested-tree';
// export * from './nested-tree-node';
export * from './flat-data-source';
export * from './nested-data-source';

@NgModule({
  imports: [CdkTreeModule, CommonModule, MatCommonModule],
  exports: [CommonModule, MatCommonModule, MatTree, MatTreeNode, MatNodeTrigger, MatNodePadding/*, MatNestedTree, MatNestedTreeNode*/],
  declarations: [MatTree, MatTreeNode, MatNodeTrigger, MatNodePadding/*, MatNestedTree, MatNestedTreeNode*/]
})
export class MatTreeModule {}
