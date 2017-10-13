/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Directive, Input} from '@angular/core';
import {CdkNodePadding, FlatNode} from '@angular/cdk/tree';

/** Workaround for https://github.com/angular/angular/issues/17849 */
export const _MatNodePadding = CdkNodePadding;

/**
 * Wrapper for the CdkTable with Material design styles.
 */
@Directive({
  selector: '[matNodePadding]',
  host: {
    '[style.padding-left]': 'paddingIndent',
  },
  providers: [{provide: CdkNodePadding, useExisting: MatNodePadding}]
})
export class MatNodePadding<T extends FlatNode> extends _MatNodePadding<T> {
  /**
   * The level of depth of the tree node. The padding will be `level * indent` pixels.
   */
  @Input('matNodePadding') level: number;

  /** The indent for each level. Default value is 28px. */
  @Input('matNodePaddingIndex') indent: number = 28;
}
