import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {FlatTreeControl, TreeControl} from '@angular/cdk/tree';
import {Observable} from 'rxjs/Observable';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import 'rxjs/add/operator/map'
import {of as ofObservable} from 'rxjs/observable/of';


export interface SimpleTreeNode {
  children: SimpleTreeNode[];
}

export class JsonNode implements SimpleTreeNode {
  children: JsonNode[];
  key: string;
  value: any;
}

export class JsonFlatNode {
  key: string;
  value: any;
  level: number;
  expandable: boolean;
  parentMap: boolean[];
}

export class JsonNestedNode/* implements NestedNode*/ {
  key: string;
  value: any;
  children: JsonNestedNode[];
  getChildren(): Observable<JsonNestedNode[]> {
    return ofObservable(this.children);
  }
}

export class JsonAdapter {

  static flattenNodes( structuredData: JsonNode[]): JsonFlatNode[] {
    let resultNodes: JsonFlatNode[] = [];
    structuredData.forEach((node) => {
      this._flattenNode(node, 0, resultNodes, []);
    });
    return resultNodes;
  }

  static _flattenNode(node: JsonNode, level: number,
                      resultNodes: JsonFlatNode[], parentMap: boolean[]) {
    let flatNode: JsonFlatNode = new JsonFlatNode();
    flatNode.key = node.key;
    flatNode.value = node.value;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    flatNode.parentMap = parentMap;
    resultNodes.push(flatNode);

    if (flatNode.expandable) {
      node.children.forEach((child, index) => {
        let childParentMap: boolean[] = parentMap.slice();
        childParentMap.push(index != node.children.length - 1);
        this._flattenNode(child, level + 1, resultNodes, childParentMap);
      });
    }
    return flatNode;
  }

  static expandFlattenedNodes(nodes: JsonFlatNode[],
                              treeControl: TreeControl<JsonFlatNode>): JsonFlatNode[] {
    let results: JsonFlatNode[] = [];
    let currentExpand: boolean[] = [];
    currentExpand[0] = true;

    nodes.forEach((node) => {
      let expand = true;
      for (let i = 0; i <= node.level; i++) {
        expand = expand && currentExpand[i];
      }
      if (expand) {
        results.push(node);
      }
      if (node.expandable) {

        currentExpand[node.level + 1] = treeControl.isExpanded(node);
      }
    });
    return results;
  }

  static nodeDecedents(node: JsonFlatNode, nodes: JsonFlatNode[], onlyExpandable: boolean = true) {
    let results: JsonFlatNode[] = [];
    let startIndex = nodes.indexOf(node);
    if (startIndex < 0) { return results; }
    for (let i = startIndex; i < nodes.length && nodes[i].level > node.level; ++i) {
      if (!onlyExpandable || nodes[i].expandable) {
        results.push(nodes[i]);
      }
    }
    return results;
  }
}

export class JsonDataSource implements DataSource<any> {
  flat: boolean = false;

  _renderedData: any[] = [];

  _flattenedData = new BehaviorSubject<any>([]);
  get flattenedData() { return this._flattenedData.value; }

  _filteredData = new BehaviorSubject<any>([]);
  get filteredData(): any { return this._filteredData.value; }

  _expandedData = new BehaviorSubject<any>([]);
  get expandedData() { return this._expandedData.value; }


  set data(value: any) {
    let tree = this.buildJsonTree(value, 0);
    this._filteredData.next(tree);
  }

  constructor(public treeControl: FlatTreeControl<JsonFlatNode>) {
    this._filteredData.subscribe((filteredData: JsonNode[]) => {
      this._flattenedData.next(JsonAdapter.flattenNodes(filteredData));
      console.log(`data source set nodes`);
      console.log(this.flattenedData);
      this.treeControl.dataNodes = this.flattenedData;
    });

    combineLatest([this.treeControl.expansionModel.onChange, this._flattenedData]).subscribe(() => {
      this._expandedData.next(JsonAdapter.expandFlattenedNodes(this.flattenedData, this.treeControl));
    });
    if (this.treeControl.expansionModel.onChange) {
      this.treeControl.expansionModel.onChange.next(undefined);
    }

  }

  connect(collectionViewer: CollectionViewer): Observable<JsonFlatNode[]> {
    return combineLatest([collectionViewer.viewChange, this._expandedData])
      .map((results: any[]) => {
        console.log(`view changed | expand`)
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
      let node = new JsonNode();
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
    this.treeControl.dataNodes = this.filteredData;
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
