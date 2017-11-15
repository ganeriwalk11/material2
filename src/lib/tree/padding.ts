/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Directive, Input} from '@angular/core';
import {CdkTreeNodePadding} from '@angular/cdk/tree';

/** Workaround for https://github.com/angular/angular/issues/17849 */
export const _MatNodePadding = CdkTreeNodePadding;

/**
 * Wrapper for the CdkTree padding with Material design styles.
 */
@Directive({
  selector: '[matNodePadding]',
  host: {
    '[style.padding-left]': 'paddingIndentLeft()',
    '[style.padding-right]': 'paddingIndentRight()',
  },
  providers: [{provide: CdkTreeNodePadding, useExisting: MatNodePadding}]
})
export class MatNodePadding<T> extends _MatNodePadding<T> {
  /**
   * The level of depth of the tree node. The padding will be `level * indent` pixels.
   */
  @Input('matNodePadding') level: number;

  /** The indent for each level. Default value is 28px. */
  @Input('matNodePaddingIndent') indent: number = 28;
}
