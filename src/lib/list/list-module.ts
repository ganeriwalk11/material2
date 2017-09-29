/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {
  MatCommonModule,
  MatLineModule,
  MatPseudoCheckboxModule,
  MatRippleModule,
} from '@angular/material/core';
import {
  MatDividerCssMatStyler,
  MatList,
  MatListAvatarCssMatStyler,
  MatListDivider,
  MatListIconCssMatStyler,
  MatListItem,
  MatListSubheaderCssMatStyler,
  MatNavList,
} from './list';
import {MatListOption, MatSelectionList} from './selection-list';


@NgModule({
  imports: [MatLineModule, MatRippleModule, MatCommonModule, MatPseudoCheckboxModule, CommonModule],
  exports: [
    MatList,
    MatNavList,
    MatListItem,
    MatListDivider,
    MatListAvatarCssMatStyler,
    MatLineModule,
    MatCommonModule,
    MatListIconCssMatStyler,
    MatDividerCssMatStyler,
    MatListSubheaderCssMatStyler,
    MatPseudoCheckboxModule,
    MatSelectionList,
    MatListOption
  ],
  declarations: [
    MatList,
    MatListItem,
    MatListDivider,
    MatListAvatarCssMatStyler,
    MatListIconCssMatStyler,
    MatDividerCssMatStyler,
    MatListSubheaderCssMatStyler,
    MatNavList,
    MatSelectionList,
    MatListOption
  ],
})
export class MatListModule {}
