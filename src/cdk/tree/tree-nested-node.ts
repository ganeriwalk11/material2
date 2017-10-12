/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  ContentChildren,
  Directive,
  forwardRef,
  Inject,
  Input,
  OnDestroy,
  QueryList,
  ViewContainerRef,
} from '@angular/core';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {Subscription} from 'rxjs/Subscription';
import {CdkTree} from './tree';
import {NestedNode} from './tree-node-data';
import {CdkNodePlaceholder} from './tree-node-placeholder';

/**
 * Nested node, add children to `cdkNodePlaceholder` in template
 */
@Directive({
  selector: '[cdkNestedNode]'
})
export class CdkNestedNode<T extends NestedNode> implements AfterContentInit, AfterViewInit, OnDestroy {
  @Input('cdkNestedNode') node: NestedNode;

  @ContentChildren(CdkNodePlaceholder) nodePlaceholder: QueryList<CdkNodePlaceholder>;

  _childrenSubscription: Subscription;
  _treeControlSubscription: Subscription;

  constructor(@Inject(forwardRef(() => CdkTree)) private tree: CdkTree<T>,
              private _changeDetectorRef: ChangeDetectorRef) {}

  viewContainer: ViewContainerRef;

  ngAfterViewInit() {
    this._treeControlSubscription =
        this.tree.treeControl.expandChange.subscribe(() => this._changeDetectorRef.detectChanges());
  }

  ngAfterContentInit() {
    // TODO (tinagao): Decide the correct time and place to add children
    this._childrenSubscription =
      combineLatest([this.node.getChildren(), this.nodePlaceholder.changes])
        .subscribe((results) => {
          this._addChildrenNodes(results[0]);
        });
  }

  ngOnDestroy() {
    if (this._childrenSubscription) {
      this._childrenSubscription.unsubscribe();
    }
    if (this._treeControlSubscription) {
      this._treeControlSubscription.unsubscribe();
    }
    this._clear();
  }

  _addChildrenNodes(children: T[]) {
    if (this.nodePlaceholder.length) {
      this.viewContainer = this.nodePlaceholder.first.viewContainer;
      this.viewContainer.clear();
      if (children.length) {
        children.forEach((child, index) => {
          this.tree.insertNode(child, index, this.viewContainer);
        });
      } else {
        this._clear();
      }
    } else {
      this._clear();
    }
    this._changeDetectorRef.detectChanges();
  }



  _clear() {
    if (this.viewContainer) {
      this.viewContainer.clear();
    }
  }
}
