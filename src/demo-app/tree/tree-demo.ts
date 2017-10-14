import {Component} from '@angular/core';
import {JsonDataSource, JsonFlatNode, JsonNestedDataSource, JsonNestedNode} from '@angular/material/tree';
import {TreeControl, FlatTreeControl, NestedTreeControl} from '@angular/cdk/tree';
import {SelectionModel} from '@angular/cdk/collections';

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

  selection: SelectionModel<JsonFlatNode> = new SelectionModel<JsonFlatNode>(true, []);

  treeControl: FlatTreeControl<JsonFlatNode>;

  nestedTreeControl: NestedTreeControl<JsonNestedNode>;

  dataSource: JsonDataSource;

  nestedDataSource: JsonNestedDataSource;

  constructor() {
    this.treeControl = new FlatTreeControl<JsonFlatNode>();
    this.dataSource = new JsonDataSource(this.treeControl);

    this.nestedTreeControl = new NestedTreeControl<JsonNestedNode>();
    this.nestedDataSource = new JsonNestedDataSource(this.treeControl);
  }

  ngAfterViewInit() {
    this._submit();
    // this.treeControl.expandChange.next([]);
    // this.nestedTreeControl.expandChange.next([]);
  }

  _submit() {
    try {
      console.log(this.data);
      let obj = JSON.parse(this.data);
      this.dataSource.data = obj;
      this.nestedDataSource.data = obj;
    } catch (e) {
      console.log(e);
    }
  }

  hasChild = (_nodeData: JsonFlatNode) => _nodeData.expandable;

  hasNestedChild = (nodeData: JsonNestedNode) => !(nodeData.value);
}

