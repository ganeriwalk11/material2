import {Component} from '@angular/core';
import {JsonDataSource, JsonFlatNode, JsonNestedDataSource, JsonNestedNode} from '@angular/material/tree';
import {TreeControl, FlatTreeControl, NestedTreeControl} from '@angular/cdk/tree';
import {SelectionModel} from '@angular/cdk/collections';
import {of as ofObservable} from 'rxjs/observable/of';

@Component({
  moduleId: module.id,
  selector: 'tree-demo',
  templateUrl: 'tree-demo.html',
  styleUrls: ['tree-demo.css'],
})
export class TreeDemo {

  data: string = `{"widget": {
    "debug": "on",
    "window": {
        "title": "Sample Konfabulator Widget",
        "name": "main_window",
        "width": 500,
        "height": 500
    },
    "image": { 
        "src": "Images/Sun.png",
        "name": "sun1",
        "hOffset": 250,
        "vOffset": 250,
        "alignment": "center"
    },
    "text": {
        "data": "Click Here",
        "size": 36,
        "style": "bold",
        "name": "text1",
        "hOffset": 250,
        "vOffset": 100,
        "alignment": "center",
        "onMouseUp": "sun1.opacity = (sun1.opacity / 100) * 90;"
    }
}}    
`;

  getLevel = (node: JsonFlatNode) => { return node.level };

  isExpandable = (node: JsonFlatNode) => { return node.expandable; }

  getChildren = (node: JsonNestedNode) => { return ofObservable(node.children); }


  selection: SelectionModel<JsonFlatNode> = new SelectionModel<JsonFlatNode>(true, []);

  treeControl: FlatTreeControl<JsonFlatNode>;

  nestedTreeControl: NestedTreeControl<JsonNestedNode>;

  dataSource: JsonDataSource;

  nestedDataSource: JsonNestedDataSource;

  constructor() {
    this.treeControl = new FlatTreeControl<JsonFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new JsonDataSource(this.treeControl);

    this.nestedTreeControl = new NestedTreeControl<JsonNestedNode>(this.getChildren);
    this.nestedDataSource = new JsonNestedDataSource(this.treeControl);
  }

  ngAfterViewInit() {
    this._submit();
  }

  _submit() {
    try {
      console.log(this.data);
      const obj = JSON.parse(this.data);
      // this.dataSource.data = obj;
      this.nestedDataSource.data = obj;
    } catch (e) {
      console.log(e);
    }

    try {
      console.log(this.data);
      const obj = JSON.parse(this.data);
      this.dataSource.data = obj;
      // this.nestedDataSource.data = obj;
    } catch (e) {
      console.log(e);
    }
  }

  hasChild = (_nodeData: JsonFlatNode) => _nodeData.expandable;

  hasNestedChild = (nodeData: JsonNestedNode) => !(nodeData.value);
}

