/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Directive, Input} from '@angular/core';
import {CdkNodeTrigger/*, FlatNode, NestedNode*/} from '@angular/cdk/tree';

/** Workaround for https://github.com/angular/angular/issues/17849 */
export const _MatNodeTrigger = CdkNodeTrigger;

/**
 * Wrapper for the CdkTable with Material design styles.
 */
@Directive({
  selector: '[matNodeTrigger]',
  host: {
    '(click)': '_trigger($event)',
  },
  providers: [{provide: CdkNodeTrigger, useExisting: MatNodeTrigger}]
})
export class MatNodeTrigger<T/* extends FlatNode|NestedNode*/> extends _MatNodeTrigger<T> {
  @Input('matNodeTriggerRecursive') recursive: boolean = true;
}
