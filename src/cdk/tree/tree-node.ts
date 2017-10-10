/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  Component,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  Renderer2,
  TemplateRef
} from '@angular/core';
import {FocusableOption, FocusMonitor} from '@angular/cdk/a11y';

/**
 * Node template
 */
@Directive({
  selector: '[cdkNodeDef]'
})
export class CdkNodeDef {
  constructor(public template: TemplateRef<any>) {}
}

// TODO: Role should be group for expandable ndoes
@Component({
  selector: 'cdk-node',
  template: '<ng-content></ng-content>',
  host: {
    'role': 'treeitem',
    '(focus)': 'focus()',
    '(blur)': 'hasFocus=false',
    'tabindex': '0',
  }
})
export class CdkNode  implements FocusableOption, OnDestroy {
  @Input('cdkNode')
  set data(v: any) {
    this._data = v;
    if ('level' in v) {
      this._role = this._data.expandable ? 'group' : 'treeitem';
    } else {
      // Nested node
      this._data.getChildren().subscribe((children) => {
        this._role = !!children ? 'group' : 'treeitem';
      })
    }
  }

  get data(): any {
    return this._data;
  }
  _data: any;

  @Input()
  get role() {
    return this._role;
  }
  _role: string;

  get offsetTop() {
    return this.elementRef.nativeElement.offsetTop;
  }

  constructor(private elementRef: ElementRef,
              private renderer: Renderer2,
              private _focusMonitor: FocusMonitor) {
    this.renderer.addClass(elementRef.nativeElement, 'mat-data');
    this._focusMonitor.monitor(this.elementRef.nativeElement, this.renderer, true);
  }


  ngOnDestroy() {
    this._focusMonitor.stopMonitoring(this.elementRef.nativeElement);
  }

  /** Focuses the menu item. */
  focus(): void {
    this.elementRef.nativeElement.focus();
  }
}
