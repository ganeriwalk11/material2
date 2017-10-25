/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {FocusableOption} from '@angular/cdk/a11y';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  ElementRef,
  forwardRef,
  Inject,
  Input,
  OnDestroy,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {takeUntil} from '@angular/cdk/rxjs';
import {CdkTree} from './tree';
import {getTreeControlFunctionsMissingError} from './tree-errors';


/**
 * Data node definition for the CdkTree.
 * Captures the node's template and a when predicate that describes when this node should be used.
 */
@Directive({
  selector: '[cdkNodeDef]',
  inputs: [
    'when: cdkNodeDefWhen',
    'getLevel: cdkNodeDefGetLevel',
    'getChildren: cdkNodeDefGetChildren',
    'isExpandable: cdkNodeDefIsExpandable'
  ],
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

  /** @docs-private */
  constructor(public template: TemplateRef<any>) {}
}


/**
 * Tree node for CdkTree. It contains the data in the tree node.
 */
@Component({
  selector: 'cdk-tree-node',
  exportAs: 'cdkTreeNode',
  template: `<ng-content></ng-content>`,
  host: {
    '[attr.role]': 'role',
    'class': 'cdk-tree-node',
    'tabindex': '0',
  },
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CdkTreeNode<T>  implements FocusableOption, OnDestroy {
  /** Emits when the component is destroyed. */
  private _destroyed = new Subject<void>();

  /** The tree node data */
  @Input('cdkTreeNode')
  set data(v: T) {
    this._data = v;
    if (this._tree.treeControl.isExpandable) {
      this.role = this._tree.treeControl.isExpandable(this._data) ? 'group' : 'treeitem';
    } else {
      if (!this._tree.treeControl.getChildren) {
        throw getTreeControlFunctionsMissingError();
      }
      takeUntil.call(this._tree.treeControl.getChildren(this._data), this._destroyed)
        .subscribe(children => {
          this.role = children ? 'group' : 'treeitem';
        });
    }
  }
  get data(): T { return this._data; }
  _data: T;

  /** The offset top of the element. Used by CdkTree to decide the order of the nodes. [Focus] */
  private get offsetTop() {
    return this._elementRef.nativeElement.offsetTop;
  }

  /**
   * The role of the node should be 'group' if it's an internal node,
   * and 'treeitem' if it's a leaf node.
   */
    // TODO: Role should be group for expandable ndoes
  @Input() role: 'treeitem' | 'group' = 'treeitem';

  constructor(private _elementRef: ElementRef,
              @Inject(forwardRef(() => CdkTree)) private _tree: CdkTree<T>,
              private _changeDetectorRef: ChangeDetectorRef) {}

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  /** Focuses the menu item. Implements for FocusableOption. */
  focus(): void {
    this._elementRef.nativeElement.focus();
  }
}
