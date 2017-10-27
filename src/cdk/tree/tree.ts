/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Input,
  IterableDiffers,
  IterableDiffer,
  IterableChangeRecord,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {takeUntil} from 'rxjs/operator/takeUntil';
import {Subject} from 'rxjs/Subject';
import {CdkTreeNodeDef, CdkTreeNode, CdkTreeNodeOutletContext} from './node';
import {TreeNodeOutlet} from './outlet';
import {TreeControl} from './control/tree-control';
import {
  getTreeControlMissingError,
  getTreeMissingMatchingNodeDefError,
  getTreeMultipleDefaultNodeDefsError
} from './tree-errors';


/**
 * CDK tree component that connects with a data source to retrieve data of type `T` and renders
 * nodes with hierarchy. Updates the nodes when new data is provided by the data source.
 */
@Component({
  selector: 'cdk-tree',
  exportAs: 'cdkTree',
  template: `<ng-container treeNodeOutlet></ng-container>`,
  host: {
    'class': 'cdk-tree',
    'role': 'tree',
  },
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CdkTree<T> implements CollectionViewer, OnInit, OnDestroy {
  /** Subject that emits when the component has been destroyed. */
  private _destroyed = new Subject<void>();

  /** Latest data provided by the data source through the connect interface. */
  private _data: Array<T> = [];

  /** Differ used to find the changes in the data provided by the data source. */
  private _dataDiffer: IterableDiffer<T>;

  /** Stores the node definition that does not have a when predicate. */
  private _defaultNodeDef: CdkTreeNodeDef<T> | null;

  /**
   * Provides a stream containing the latest data array to render. Influenced by the tree's
   * stream of view window (what nodes are currently on screen).
   */
  @Input()
  get dataSource(): DataSource<T> { return this._dataSource; }
  set dataSource(dataSource: DataSource<T>) {
    if (this._dataSource !== dataSource) {
      this._switchDataSource(dataSource);
    }
  }
  private _dataSource: DataSource<T>;

  /** The tree controller */
  @Input() treeControl: TreeControl<T>;

  // TODO(andrewseguin): Remove max value as the end index
  //   and instead calculate the view on init and scroll.
  /**
   * Stream containing the latest information on what nodes are being displayed on screen.
   * Can be used by the data source to as a heuristic of what data should be provided.
   */
  viewChange =
    new BehaviorSubject<{start: number, end: number}>({start: 0, end: Number.MAX_VALUE});

  // Outlets within the tree's template where the nodes will be inserted.
  @ViewChild(TreeNodeOutlet) _nodeOutlet: TreeNodeOutlet;

  /** The tree node template for the tree */
  @ContentChildren(CdkTreeNodeDef) _nodeDefs: QueryList<CdkTreeNodeDef<T>>;

  /** The tree node inside the tree */
  @ContentChildren(CdkTreeNode, {descendants: true}) items: QueryList<CdkTreeNode<T>>;

  constructor(private _differs: IterableDiffers,
              private _changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    this._dataDiffer = this._differs.find([]).create();
    if (!this.treeControl) {
      throw getTreeControlMissingError();
    }
  }

  ngOnDestroy() {
    this._nodeOutlet.viewContainer.clear();

    this._destroyed.next();
    this._destroyed.complete();

    if (this.dataSource) {
      this.dataSource.disconnect(this);
    }
  }

  ngAfterContentChecked() {
    const defaultNodeDefs = this._nodeDefs.filter(def => !def.when);
    if (defaultNodeDefs.length > 1) { throw getTreeMultipleDefaultNodeDefsError(); }
    this._defaultNodeDef = defaultNodeDefs[0];

    if (this.dataSource) {
      this._observeRenderChanges();
    }
  }

  // TODO(tinayuangao): Work on keyboard traversal and actions, make sure it's working for RTL
  //     and nested trees.

  /**
   * Switch to the provided data source by resetting the data and unsubscribing from the current
   * render change subscription if one exists. If the data source is null, interpret this by
   * clearing the node outlet. Otherwise start listening for new data.
   */
  private _switchDataSource(dataSource: DataSource<T>) {
    this._data = [];

    if (this.dataSource) {
      this.dataSource.disconnect(this);
    }

    // Remove the all nodes if there is now no data source
    if (!dataSource) {
      this._nodeOutlet.viewContainer.clear();
    }

    this._dataSource = dataSource;
  }

  /** Set up a subscription for the data provided by the data source. */
  private _observeRenderChanges() {
    takeUntil.call(this.dataSource.connect(this), this._destroyed)
      .subscribe(data => {
        this._data = data;
        this._renderNodeChanges(data);
      });
  }

  /** Check for changes made in the data and render each change (node added/removed/moved). */
  private _renderNodeChanges(dataNodes: T[]) {
    const changes = this._dataDiffer.diff(dataNodes);
    if (!changes) { return; }

    const viewContainer = this._nodeOutlet.viewContainer;
    changes.forEachOperation(
      (item: IterableChangeRecord<T>, adjustedPreviousIndex: number, currentIndex: number) => {
        if (item.previousIndex == null) {
          this.insertNode(dataNodes[currentIndex], currentIndex);
        } else if (currentIndex == null) {
          viewContainer.remove(adjustedPreviousIndex);
        } else {
          const view = viewContainer.get(adjustedPreviousIndex);
          viewContainer.move(view!, currentIndex);
        }
      });
  }

  /**
   * Finds the matching node definition that should be used for this node data. If there is only
   * one node definition, it is returned. Otherwise, find the node definition that has a when
   * predicate that returns true with the data. If none return true, return the default node
   * definition.
   */
  _getNodeDef(data: T, i: number): CdkTreeNodeDef<T> {
    if (this._nodeDefs.length == 1) { return this._nodeDefs.first; }

    const nodeDef =
      this._nodeDefs.find(def => def.when && def.when(data, i)) || this._defaultNodeDef;
    if (!nodeDef) { throw getTreeMissingMatchingNodeDefError(); }

    return nodeDef;
  }

  /**
   * Create the embedded view for the data node template and place it in the correct index location
   * within the data node view container.
   */
  insertNode(nodeData: T, index: number, viewContainer?: ViewContainerRef) {
    const node = this._getNodeDef(nodeData, index);

    // Node context that will be provided to created embedded view
    const context: CdkTreeNodeOutletContext<T> = new CdkTreeNodeOutletContext<T>(nodeData);

    // Use default tree nodeOutlet, or nested node's nodeOutlet
    const container = viewContainer ? viewContainer : this._nodeOutlet.viewContainer;
    container.createEmbeddedView(node.template, context, index);

    this._changeDetectorRef.detectChanges();
  }
}
