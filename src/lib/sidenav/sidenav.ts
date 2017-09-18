/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, ContentChild,
  ContentChildren, forwardRef, Inject, Input,
  ViewEncapsulation
} from '@angular/core';
import {MdDrawer, MdDrawerContainer, MdDrawerContent} from './drawer';
import {animate, state, style, transition, trigger} from '@angular/animations';


@Component({
  moduleId: module.id,
  selector: 'md-sidenav-content, mat-sidenav-content',
  template: '<ng-content></ng-content>',
  host: {
    'class': 'mat-drawer-content mat-sidenav-content',
    '[style.marginLeft.px]': '_margins.left',
    '[style.marginRight.px]': '_margins.right',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MdSidenavContent extends MdDrawerContent {
  constructor(
      changeDetectorRef: ChangeDetectorRef,
      @Inject(forwardRef(() => MdSidenavContainer)) container: MdSidenavContainer) {
    super(changeDetectorRef, container);
  }
}


@Component({
  moduleId: module.id,
  selector: 'md-sidenav, mat-sidenav',
  template: '<ng-content></ng-content>',
  animations: [
    trigger('transform', [
      state('open, open-instant', style({
        transform: 'translate3d(0, 0, 0)',
        visibility: 'visible',
      })),
      state('void', style({
        visibility: 'hidden',
      })),
      transition('void => open-instant', animate('0ms')),
      transition('void <=> open, open-instant => void',
        animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)'))
    ])
  ],
  host: {
    'class': 'mat-drawer mat-sidenav',
    'tabIndex': '-1',
    '[@transform]': '_animationState',
    '(@transform.start)': '_onAnimationStart()',
    '(@transform.done)': '_onAnimationEnd($event)',
    '(keydown)': 'handleKeydown($event)',
    // must prevent the browser from aligning text based on value
    '[attr.align]': 'null',
    '[class.mat-drawer-end]': 'position === "end"',
    '[class.mat-drawer-over]': 'mode === "over"',
    '[class.mat-drawer-push]': 'mode === "push"',
    '[class.mat-drawer-side]': 'mode === "side"',
    '[class.mat-sidenav-fixed]': 'fixedInViewport',
    '[style.top.px]': 'fixedInViewport ? fixedTopGap : null',
    '[style.bottom.px]': 'fixedInViewport ? fixedBottomGap : null',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MdSidenav extends MdDrawer {
  /** Whether the sidenav is fixed in the viewport. */
  @Input() fixedInViewport = true;

  /**
   * The gap between the top of the sidenav and the top of the viewport when the sidenav is in fixed
   * mode.
   */
  @Input() fixedTopGap = 0;

  /**
   * The gap between the bottom of the sidenav and the bottom of the viewport when the sidenav is in
   * fixed mode.
   */
  @Input() fixedBottomGap = 0;
}


@Component({
  moduleId: module.id,
  selector: 'md-sidenav-container, mat-sidenav-container',
  templateUrl: 'sidenav-container.html',
  styleUrls: [
    'drawer.css',
    'drawer-transitions.css',
  ],
  host: {
    'class': 'mat-drawer-container mat-sidenav-container',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MdSidenavContainer extends MdDrawerContainer {
  @ContentChildren(MdSidenav) _drawers;

  @ContentChild(MdSidenavContent) _content;
}
