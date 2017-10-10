/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {FocusKeyManager} from '@angular/cdk/a11y';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {UP_ARROW, DOWN_ARROW, RIGHT_ARROW, LEFT_ARROW} from '@angular/cdk/keycodes';
import {RxChain, debounceTime} from '@angular/cdk/rxjs';
import {
  AfterViewInit,
  ViewChild,
  Component,
  TemplateRef,
  ChangeDetectorRef,
  ContentChildren,
  QueryList,
  ViewContainerRef,
  Input,
  IterableDiffers,
  IterableDiffer,
  ViewEncapsulation,
  ElementRef,
  OnInit,
  OnDestroy,
  IterableChangeRecord
} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {fromEvent} from 'rxjs/observable/fromEvent';
import {CdkNodeDef, CdkNode} from './tree-node';
import {FlatNode} from './tree-node-data';
import {CdkNodePlaceholder} from './tree-node-placeholder';
import {TreeControl} from './tree-control';

/** Height of each row in pixels (48 + 1px border) */
export const ROW_HEIGHT = 49;

/** Amount of rows to buffer around the view */
export const BUFFER = 3;


@Component({
  selector: 'cdk-tree',
  template: `
    <ng-container cdkNodePlaceholder></ng-container>
    <ng-template #emptyNode><div class="mat-placeholder"></div></ng-template>
  `,
  host: {
    'role': 'tree',
    'class': 'mat-tree',
    '(focus)': 'focus()',
    '(keydown)': 'handleKeydown($event)'
  },
  encapsulation: ViewEncapsulation.None,
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class CdkTree implements CollectionViewer, AfterViewInit, OnInit, OnDestroy {

  _viewInitialized: boolean = false;

  /** Data source */
  @Input() dataSource: DataSource<any>;

  /** The tree controller */
  @Input() treeControl: TreeControl;

  /** View changed for CollectionViewer */
  viewChange = new BehaviorSubject({start: 0, end: 20});

  /** Data differerences for the ndoes */
  private _dataDiffer: IterableDiffer<any>;

  // Focus related
  _keyManager: FocusKeyManager<CdkNode>;

  orderedNodes: QueryList<CdkNode> = new QueryList<CdkNode>();

  @ContentChildren(CdkNode, {descendants: true}) items: QueryList<CdkNode>;
  @ContentChildren(CdkNodeDef) nodeDefinitions: QueryList<CdkNodeDef>;
  @ViewChild(CdkNodePlaceholder) nodePlaceholder: CdkNodePlaceholder;
  @ViewChild('emptyNode') emptyNodeTemplate: TemplateRef<any>;

  constructor(private _differs: IterableDiffers, private elementRef: ElementRef,
              private changeDetectorRef: ChangeDetectorRef) {
    this._dataDiffer = this._differs.find([]).create();
  }

  ngOnInit() {
    RxChain.from(fromEvent(this.elementRef.nativeElement, 'scroll'))
      .call(debounceTime, 100)
      .subscribe(() => this.scrollEvent());
  }

  ngDoCheck() {
    if (this.dataSource && this._viewInitialized) {
      this.dataSource.connect(this).subscribe((result: any[]) => {
        this.renderNodeChanges(result);
      });
    }
  }

  ngOnDestroy() {
    if (this.dataSource) {
      this.dataSource.disconnect(this);
    }
  }

  ngAfterViewInit() {
    // this.treeControl.expandChange.subscribe(() => this.changeDetectorRef.detectChanges());
    this._viewInitialized = true;
    this.items.changes.subscribe((items) => {
      let nodes = items.toArray();

      nodes.sort((a, b) => {
        return a.offsetTop - b.offsetTop;
      });
      this.orderedNodes.reset(nodes);

      let activeItem = this._keyManager ? this._keyManager.activeItem : null;
      this._keyManager = new FocusKeyManager(this.orderedNodes);
      if (activeItem instanceof CdkNode) {
        this.updateFocusedNode(activeItem);
      }
      this.changeDetectorRef.detectChanges();
    })
  }

  renderNodeChanges(dataNodes: FlatNode[]) {
    const changes = this._dataDiffer.diff(dataNodes);
    if (!changes) { return; }

    const oldScrollTop = this.elementRef.nativeElement.scrollTop;
    changes.forEachOperation(
      (item: IterableChangeRecord<any>, adjustedPreviousIndex: number, currentIndex: number) => {
        if (item.previousIndex == null) {
          this.addNode(this.nodePlaceholder.viewContainer, dataNodes[currentIndex], currentIndex);
        } else if (currentIndex == null) {
          this.nodePlaceholder.viewContainer.remove(adjustedPreviousIndex);
        } else {
          const view = this.nodePlaceholder.viewContainer.get(adjustedPreviousIndex);
          if (view) {
            this.nodePlaceholder.viewContainer.move(view, currentIndex);
          }
        }
      });

    // Scroll changes in the process of adding/removing rows. Reset it back to where it was
    // so that it (1) it does not shift and (2) a scroll event does not get triggered which
    // would cause a loop.
    this.elementRef.nativeElement.scrollTop = oldScrollTop;
    this.changeDetectorRef.detectChanges();
  }

  addNode(viewContainer: ViewContainerRef, data: any, currentIndex: number) {
    if (!!data) {
      this._addNodeInContainer(viewContainer, data, currentIndex);
    } else {
      viewContainer.createEmbeddedView(this.emptyNodeTemplate, {}, currentIndex);
    }
  }

  _addNodeInContainer(container: ViewContainerRef, data: any, currentIndex: number) {
    let node = this.getNodeDefForItem(data);
    let context = {
      $implicit: data
    };
    container.createEmbeddedView(node.template, context, currentIndex);
  }

  getNodeDefForItem(_) {
    // proof-of-concept: only supporting one row definition
    return this.nodeDefinitions.first;
  }

  scrollEvent() {
    const scrollTop = this.elementRef.nativeElement.scrollTop;
    const elementHeight = this.elementRef.nativeElement.getBoundingClientRect().height;

    const topIndex = Math.floor(scrollTop / ROW_HEIGHT);

    const view = {
      start: Math.max(topIndex - BUFFER, 0),
      end: Math.ceil(topIndex + (elementHeight / ROW_HEIGHT)) + BUFFER
    };

    this.viewChange.next(view);
  }

  printData() {
    this.items.forEach((node) => console.log(node.data));
  }

  // Key related
  // TODO(tinagao): Work on keyboard traversal
  handleKeydown(event) {
    if (event.keyCode == UP_ARROW) {
      this._keyManager.setPreviousItemActive();
    } else if (event.keyCode == DOWN_ARROW) {
      this._keyManager.setNextItemActive();
    } else if (event.keyCode == RIGHT_ARROW) {
      let activeNode = this._keyManager.activeItem;
      if (activeNode instanceof CdkNode) {
        this.treeControl.expand(activeNode.data);
        this.changeDetectorRef.detectChanges();
      }
    } else if (event.keyCode == LEFT_ARROW) {
      let activeNode = this._keyManager.activeItem;
      if (activeNode instanceof CdkNode) {
        this.treeControl.collapse(activeNode.data);
        this.changeDetectorRef.detectChanges();
      }
    }
  }

  updateFocusedNode(node: CdkNode) {
    let index = this.orderedNodes.toArray().indexOf(node);
    if (this._keyManager && index > -1) {
      this._keyManager.setActiveItem(Math.min(this.orderedNodes.length -1, index));
    }
  }
}
