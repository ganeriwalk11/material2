/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Observable} from 'rxjs/Observable';

/** Interface for data in flat tree. Tree users should implement this interface to use CdkTree. */
export interface FlatNode {
  getLevel(): number;
  isExpandable(): boolean;
}

/** Interface for data in nested tree. Tree users should implement this interface to use CdkTree. */
export interface NestedNode {
  getChildren(): Observable<NestedNode[]>;
}
