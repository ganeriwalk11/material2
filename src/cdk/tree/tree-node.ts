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
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import {FocusableOption, FocusMonitor} from '@angular/cdk/a11y';

/** The tree node template */
export const CDK_TREE_NODE_TEMPLATE = '<ng-content cdkNodeOutlet></ng-content>';

/**
 * Node template
 */
@Directive({
  selector: '[cdkNodeDef]'
})
export class CdkNodeDef<T> {
  /**
   * Function that should return true if this node template should be used for the provided node
   * data and index. If left undefined, this node will be considered the default node template to
   * use when no other when functions return true for the data.
   * For every node, there must be at least one when function that passes or an undefined to
   * default.
   */
  when: (nodeData: T, index: number) => boolean;

  constructor(public template: TemplateRef<any>) {}
}

// TODO: Role should be group for expandable ndoes
@Component({
  selector: 'cdk-tree-node',
  template: CDK_TREE_NODE_TEMPLATE,
  host: {
    'role': 'treeitem',
    '(focus)': 'focus()',
    '(blur)': 'hasFocus=false',
    'tabindex': '0',
  }
})
export class CdkTreeNode<T>  implements FocusableOption, OnDestroy {
  @Input('cdkNode')
  set data(v: T) {
    this._data = v;
    // if ('level' in v) {
    //   this._role = this._data.expandable ? 'group' : 'treeitem';
    // } else {
    //   // Nested node
    //   this._data.getChildren().subscribe((children) => {
    //     this._role = !!children ? 'group' : 'treeitem';
    //   })
    // }
  }

  get data(): T {
    return this._data;
  }
  _data: T;

  @Input()
  get role() {
    return this._role;
  }
  _role: string = 'treeitem';


  constructor(private _elementRef: ElementRef,
              private _renderer: Renderer2,
              private _focusMonitor: FocusMonitor) {
    this._renderer.addClass(_elementRef.nativeElement, 'mat-data');
    this._focusMonitor.monitor(this._elementRef.nativeElement, this._renderer, true);
  }


  ngOnDestroy() {
    this._focusMonitor.stopMonitoring(this._elementRef.nativeElement);
  }

  /** Focuses the menu item. */
  focus(): void {
    this._elementRef.nativeElement.focus();
  }
}
