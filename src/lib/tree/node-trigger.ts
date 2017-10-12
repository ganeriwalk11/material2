import {ChangeDetectionStrategy, Directive, ViewEncapsulation} from '@angular/core';
import { CdkNodeTrigger, CdkNodePadding} from '@angular/cdk/tree';

/** Workaround for https://github.com/angular/angular/issues/17849 */
export const _MatNodeTrigger = CdkNodeTrigger;

/**
 * Wrapper for the CdkTable with Material design styles.
 */
@Directive({
  selector: '[matNodeTrigger]',
  host: {
    '(click)': 'trigger($event)',
  },
  providers: [{provide: CdkNodeTrigger, useExisting: MatNodeTrigger}]
})
export class MatNodeTrigger<T> extends _MatNodeTrigger<T> {}


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
export class MatNodePadding extends _MatNodePadding { }
