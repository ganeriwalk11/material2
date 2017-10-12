import {Component} from '@angular/core';
import {JsonDataSource, JsonFlatNode} from '@angular/material/tree';
import {TreeControl, FlatTreeControl} from '@angular/cdk/tree';
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

  treeControl: TreeControl;

  dataSource: JsonDataSource;

  constructor() {
    this.treeControl = new FlatTreeControl<JsonFlatNode>();
    this.dataSource = new JsonDataSource(this.treeControl as FlatTreeControl<JsonFlatNode>);
  }

  ngAfterViewInit() {
    this._submit();
    this.treeControl.expandChange.next([]);
  }

  _submit() {
    try {
      console.log(this.data);
      let obj = JSON.parse(this.data);
      this.dataSource.data = obj;
    } catch (e) {
      console.log(e);
    }
  }
}

