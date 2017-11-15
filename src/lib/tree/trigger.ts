/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Directive, Input} from '@angular/core';
import {CdkTreeNodeTrigger} from '@angular/cdk/tree';

/** Workaround for https://github.com/angular/angular/issues/17849 */
export const _MatNodeTrigger = CdkTreeNodeTrigger;

/**
 * Wrapper for the CdkTree's trigger with Material design styles.
 */
@Directive({
  selector: '[matNodeTrigger]',
  host: {
    '(click)': '_trigger($event)',
  },
  providers: [{provide: CdkTreeNodeTrigger, useExisting: MatNodeTrigger}]
})
export class MatNodeTrigger<T> extends _MatNodeTrigger<T> {
  @Input('matNodeTriggerRecursive') recursive: boolean = true;
}
