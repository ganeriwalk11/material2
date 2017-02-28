import {
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  NgModule,
  Output,
  QueryList,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {PortalModule, Portal} from '../core';
import {MdTreeNode} from './tree-node';

export class MdTreeChange {
  key: string;
  value: boolean;
}

@Component({
  selector: 'md-tree',
  host: {
  },
  templateUrl: 'tree.html',
  styleUrls: ['tree.css'],

})
export class MdTree {
  @ContentChildren(MdTreeNode) treeNodes: QueryList<MdTreeNode>;

  @Input()
  nodeTemplate: Portal<any>;

  /**  The keys of the nodes which are expanded. */
  _expandedKeys: string[] = [];

  /** The keys of the nodes which are selected. */
  _selectedKeys: string[] = [];

  @Input()
  get expandedKeys() {
    return this._expandedKeys;
  }
  set expandedKeys(keys: string[]) {
    console.log(`expanded keys ${keys}`);
    this._expandedKeys = keys;
  }

  @Input()
  get selectedKeys() {
    return this._selectedKeys;
  }
  set selectedKeys(keys: string[]) {
    this._selectedKeys = keys;
  }

  @Input()
  selectChildren: boolean = false;

  @Input()
  disabled: boolean;

  @Input()
  loadData: (node: MdTreeNode) => {};

  @Output()
  selectChange: EventEmitter<MdTreeChange> = new EventEmitter<MdTreeChange>();

  @Output()
  expandChange: EventEmitter<MdTreeChange> = new EventEmitter<MdTreeChange>();

  updateSelected(key: string, selected: boolean) {
    let index = this._selectedKeys.indexOf(key);
    if (index == -1 && selected) {
      this._selectedKeys.push(key);
      this._emitTreeChange(key, 'select', true);
    } else if (index > -1 && !selected) {
      this._selectedKeys.splice(index, 1);
      this._emitTreeChange(key, 'select', false);
    }
  }

  updateExpanded(key: string, expanded: boolean) {
    let index = this._expandedKeys.indexOf(key);
    if (index == -1 && expanded) {
      this._expandedKeys.push(key);
      this._emitTreeChange(key, 'expand', true);
    } else if (index > -1 && !expanded) {
      this._expandedKeys.splice(index, 1);
      this._emitTreeChange(key, 'expand', false);
    }
  }

  _emitTreeChange(key: string, type: 'select' | 'expand', value: boolean) {
    let change = new MdTreeChange();
    change.key = key;
    change.value = value;
    if (type == 'select') {
      this.selectChange.emit(change);
    } else {
      this.expandChange.emit(change);
    }
    console.log(`emit tree change ${key} ${type} ${value}`);
  }
}


@NgModule({
  imports: [BrowserModule, PortalModule],
  exports: [MdTreeNode, MdTree],
  declarations: [MdTreeNode, MdTree],
})
export class MdTreeModule {}