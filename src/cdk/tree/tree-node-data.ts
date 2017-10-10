/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Observable} from 'rxjs/Observable';

export interface FlatNode {
  level: number;
  expandable: boolean;
}

export interface NestedNode {
  getChildren(): Observable<NestedNode[]>;
}

export interface SimpleTreeNode {
  children: this[];
}
