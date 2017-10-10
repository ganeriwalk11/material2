/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  AfterContentInit,
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
export class CdkNestedNode implements AfterContentInit, OnDestroy {
  @Input('cdkNestedNode') node: NestedNode;

  @ContentChildren(CdkNodePlaceholder) nodePlaceholder: QueryList<CdkNodePlaceholder>;

  _childrenSubscription: Subscription;

  constructor(@Inject(forwardRef(() => CdkTree)) private tree: CdkTree,
              public changeDetectorRef: ChangeDetectorRef) {}

  viewContainer: ViewContainerRef;

  ngAfterViewInit() {
    // this.tree.treeControl.expandChange.subscribe(() => this.changeDetectorRef.detectChanges());
  }

  ngAfterContentInit() {
    this._childrenSubscription =
      combineLatest([this.node.getChildren(), this.nodePlaceholder.changes])
        .subscribe((results) => {
          this._addChildrenNodes(results[0]);
        });
  }

  _addChildrenNodes(children: NestedNode[]) {
    if (this.nodePlaceholder.length) {
      this.viewContainer = this.nodePlaceholder.first.viewContainer;
      this.viewContainer.clear();
      if (children) {
        children.forEach((child, index) => {
          this.tree.addNode(this.viewContainer, child, index);
        });

      }
    } else {
      this.clear();
    }
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy() {
    if (this._childrenSubscription) {
      this._childrenSubscription.unsubscribe();
    }
    this.clear();
  }

  clear() {
    if (this.viewContainer) {
      this.viewContainer.clear();
    }
  }
}
