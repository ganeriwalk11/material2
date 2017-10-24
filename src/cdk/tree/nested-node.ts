/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  AfterContentInit,
  ContentChildren,
  Directive,
  forwardRef,
  Inject,
  OnDestroy,
  QueryList,
} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {takeUntil} from '@angular/cdk/rxjs';
import {CdkTree} from './tree';
import {NestedNode} from './tree-data';
import {CdkNodeOutlet} from './outlet';
import {CdkTreeNode} from './node';


/**
 * Nested node is a child of `<cdk-tree>`. It works with `NestedNode` node type.
 * By adding `cdkNestedTreeNode` to the tree node template, children of the parent node will be added in
 * the `cdkNodeOutlet` in tree node template.
 * For example:
 *   <cdk-tree-node cdkNestedTreeNode [cdkNode]="node">
 *     tree node data: {{node.name}}
 *     <ng-template cdkNodeOutlet> </ng-template>
 *   </cdk-tree-node>
 * The children of node will be automatically added to `cdkNodeOutlet`, the result dom will be like
 * this:
 *   <cdk-tree-node cdkNestedTreeNode [cdkNode]="node">
 *     tree node data: {{node.name}}
 *     <ng-template cdkNodeOutlet>
 *       <cdk-tree-node cdKNestedTreeNode [cdkNode]="child1"></cdk-tree-node>
 *       <cdk-tree-node cdKNestedTreeNode [cdkNode]="child2"></cdk-tree-node>
 *     </ng-template>
 *   </cdk-tree-node>
 */
@Directive({
  selector: '[cdkNestedTreeNode]'
})
export class CdkNestedTreeNode<T extends NestedNode> implements AfterContentInit, OnDestroy {

  /** Emits when the component is destroyed. */
  private _destroyed = new Subject<void>();

  /** The children data nodes of current NestedNode They will be placed in `CdkNodeOutlet`. */
  protected _children: T[];

  /** The children node placeholder. */
  @ContentChildren(CdkNodeOutlet) nodeOutlet: QueryList<CdkNodeOutlet>;

  constructor(@Inject(forwardRef(() => CdkTree)) private tree: CdkTree<T>,
              public treeNode: CdkTreeNode<T>) {}

  ngAfterContentInit() {
    takeUntil.call(this.treeNode.data.getChildren(), this._destroyed).subscribe(result => {
      // In case when nodePlacholder is not in the DOM when children changes, save it in the node
      // and add to nodeOutlet when it's available.
      this._children = result as T[];
      this._addChildrenNodes();
    });
    takeUntil.call(this.nodeOutlet.changes, this._destroyed)
      .subscribe((_) => this._addChildrenNodes());
  }

  ngOnDestroy() {
    this._clear();
    this._destroyed.next();
    this._destroyed.complete();
  }

  /** Add children nodes to the NodePlacholder */
  protected _addChildrenNodes() {
    this._clear();
    if (this.nodeOutlet.length && this._children) {
      this._children.forEach((child, index) => {
        this.tree.insertNode(child, index, this.nodeOutlet.first.viewContainer);
      });
    }
  }

  /** Clear the children nodes. */
  protected _clear() {
    if (this.nodeOutlet.first.viewContainer) {
      this.nodeOutlet.first.viewContainer.clear();
    }
  }
}
