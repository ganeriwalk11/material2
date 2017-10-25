import {DataSource, CollectionViewer} from '@angular/cdk/collections';
import {/*NestedNode, */TreeControl} from '@angular/cdk/tree';
import {Observable} from 'rxjs/Observable';
import {of as ofObservable} from 'rxjs/observable/of';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map'
// import 'rxjs/add/observable/combineLatest';
// import 'rxjs/add/operator/debounceTime';
// import 'rxjs/add/operator/mergeMap';
// import 'rxjs/add/operator/pairwise';
// import 'rxjs/add/operator/distinctUntilChanged';

import {JsonNode, SimpleTreeNode} from './shared-data-source';

export class JsonNestedNode/* implements NestedNode*/ {
  key: string;
  value: any;
  children: JsonNestedNode[];
  getChildren(): Observable<JsonNestedNode[]> {
    return ofObservable(this.children);
  }
}

export class JsonNestedDataSource implements DataSource<any> {

  dottedLineLevels = new Map<any, number[]>();
  flat: boolean = false;

  _renderedData: any[] = [];

  _filteredData = new BehaviorSubject<any>([]);
  get filteredData(): any { return this._filteredData.value; }

  set data(value: any) {
    let tree = this.buildJsonTree(value, 0);
    this._filteredData.next(tree);
    console.log(`nested data source set nodes`)
    console.log(this.filteredData);
    this.treeControl.nodes = this.filteredData;
  }

  constructor(public treeControl: TreeControl<any>) {}

  connect(collectionViewer: CollectionViewer): Observable<JsonNestedNode[]> {
    return combineLatest([collectionViewer.viewChange, this._filteredData])
      .map((results: any[]) => {
        let [view, displayData] = results;

        // Set the rendered rows length to the virtual page size. Fill in the data provided
        // from the index start until the end index or pagination size, whichever is smaller.
        this._renderedData.length = displayData.length;

        const buffer = 20;
        const rangeStart = Math.max(0, view.start - buffer);
        const rangeEnd = Math.min(displayData.length, view.end + buffer);
        for (let i = rangeStart; i < rangeEnd; i++) {
          this._renderedData[i] = displayData[i];
        }

        return this._renderedData; // Currently ignoring the view
      });
  }
  
  
  disconnect() {
    
  }

  buildJsonTree(value: any, level: number) {
    let data: any[] = [];
    for (let k in value) {
      let v = value[k];
      let node = new JsonNestedNode();
      node.key = `${k}`;
      if (v === null || v === undefined) {
        // no action
      } else if (typeof v === 'object') {
        node.children = this.buildJsonTree(v, level + 1);
      } else {
        node.value = v;
      }
      data.push(node);
    }
    return data;
  }

  addChild(key: string, value: string, node: JsonNode) {
    if (!node.children) {
      node.children = [];
    }
    let child = new JsonNode();
    child.key = key;
    child.value = value;
    node.children.push(child);
    this._filteredData.next(this._filteredData.value);
  }
}
