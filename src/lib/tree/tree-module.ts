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
import {MatNode, MatNodeDef} from './node';
import {CommonModule} from '@angular/common';
import {MatCommonModule} from '@angular/material/core';

@NgModule({
  imports: [CdkTreeModule, CommonModule, MatCommonModule],
  exports: [MatTree, MatNodeDef, MatNode],
  declarations: [MatTree, MatNodeDef, MatNode],
})
export class MatTreeModule {}
