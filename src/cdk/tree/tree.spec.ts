// import {async, ComponentFixture, TestBed} from '@angular/core/testing';
// import {Component, ViewChild} from '@angular/core';
// import {CdkTree} from './tree';
// import {CollectionViewer, DataSource} from '@angular/cdk/collections';
// import {BehaviorSubject} from 'rxjs/BehaviorSubject';
// import {Observable} from 'rxjs/Observable';
// import {combineLatest} from 'rxjs/observable/combineLatest';
// import {CdkTreeModule} from './index';
// import {map} from 'rxjs/operator/map';
//
//
// describe('CdkTree', () => {
//   let fixture: ComponentFixture<SimpleCdkTreeApp>;
//
//   let component: SimpleCdkTreeApp;
//   let dataSource: FakeDataSource;
//   let tree: CdkTree<any>;
//   let treeElement: HTMLElement;
//
//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       imports: [CdkTreeModule],
//       declarations: [
//         SimpleCdkTreeApp,
//         DynamicDataSourceCdkTreeApp,
//         NodeContextCdkTreeApp,
//         WhenNodeCdkTreeApp
//       ],
//     }).compileComponents();
//   }));
//
//   beforeEach(() => {
//     fixture = TestBed.createComponent(SimpleCdkTreeApp);
//
//     component = fixture.componentInstance;
//     dataSource = component.dataSource as FakeDataSource;
//     tree = component.tree;
//     treeElement = fixture.nativeElement.querySelector('cdk-ree');
//
//     fixture.detectChanges();
//   });
//
//   describe('should initialize', () => {
//     it('with a connected data source', () => {
//       expect(tree.dataSource).toBe(dataSource);
//       expect(dataSource.isConnected).toBe(true);
//     });
//
//     it('with rendered nodes', () => {
//       const nodes = getNodes(treeElement);
//
//       expect(nodes).not.toBe(undefined);
//       expect(nodes.classList).toContain('customNodeClass');
//     });
//
//     it('with the right accessibility roles', () => {
//       expect(treeElement.getAttribute('role')).toBe('tree');
//
//       expect(getNodes(treeElement).getAttribute('role')).toBe('treeitem');
//       getNodes(treeElement).forEach(node => {
//         expect(node.getAttribute('role')).toBe('treeitem');
//       });
//     });
//   });
//
//   it('should disconnect the data source when tree is destroyed', () => {
//     expect(dataSource.isConnected).toBe(true);
//
//     fixture.destroy();
//     expect(dataSource.isConnected).toBe(false);
//   });
//
//   it('should re-render the nodess when the data changes', () => {
//     dataSource.addData();
//     fixture.detectChanges();
//
//     const nodes = getNodes(treeElement);
//     expect(nodes.length).toBe(dataSource.data.length);
//   });
//
//   describe('using when predicate', () => {
//     it('should be able to display different node templates based on the node data', () => {
//       let whenFixture = TestBed.createComponent(WhenNodeCdkTreeApp);
//       whenFixture.detectChanges();
//
//       let data = whenFixture.componentInstance.dataSource.data;
//       expectTableToMatchContent(whenFixture.nativeElement.querySelector('cdk-tree'), [
//         ['Column A', 'Column B', 'Column C'],
//         [data[0].a, data[0].b, data[0].c],
//         ['index_1_special_row'],
//         ['c3_special_row'],
//         [data[3].a, data[3].b, data[3].c],
//       ]);
//     });
//   });
//
//   it('should use differ to add/remove/move nodes', () => {
//
//   });
//
//   it('should clear the node view containers on destroy', () => {
//     const nodePlaceholder = fixture.componentInstance.tree._nodePlaceholder.viewContainer;
//
//     spyOn(nodePlaceholder, 'clear').and.callThrough();
//
//     fixture.destroy();
//
//     expect(nodePlaceholder.clear).toHaveBeenCalled();
//   });
//
//   it('should match the right tree content with dynamic data', () => {
//     const initialDataLength = dataSource.data.length;
//     expect(dataSource.data.length).toBe(3);
//
//     let data = dataSource.data;
//     expectTableToMatchContent(treeElement, [
//       ['Column A', 'Column B', 'Column C'],
//       [data[0].a, data[0].b, data[0].c],
//       [data[1].a, data[1].b, data[1].c],
//       [data[2].a, data[2].b, data[2].c],
//     ]);
//
//     // Add data to the table and recreate what the rendered output should be.
//     dataSource.addData();
//     expect(dataSource.data.length).toBe(initialDataLength + 1); // Make sure data was added
//     fixture.detectChanges();
//
//     data = dataSource.data;
//     expectTableToMatchContent(tableElement, [
//       ['Column A', 'Column B', 'Column C'],
//       [data[0].a, data[0].b, data[0].c],
//       [data[1].a, data[1].b, data[1].c],
//       [data[2].a, data[2].b, data[2].c],
//       [data[3].a, data[3].b, data[3].c],
//     ]);
//   });
//
//   it('should match the right table content with dynamic data source', () => {
//     const dynamicDataSourceFixture = TestBed.createComponent(DynamicDataSourceCdkTableApp);
//     component = dynamicDataSourceFixture.componentInstance;
//     tableElement = dynamicDataSourceFixture.nativeElement.querySelector('cdk-table');
//     dynamicDataSourceFixture.detectChanges();
//
//     // Expect that the component has no data source and the table element reflects empty data.
//     expect(component.dataSource).toBe(undefined);
//     expectTableToMatchContent(tableElement, [
//       ['Column A']
//     ]);
//
//     // Add a data source that has initialized data. Expect that the table shows this data.
//     const dynamicDataSource = new FakeDataSource();
//     component.dataSource = dynamicDataSource;
//     dynamicDataSourceFixture.detectChanges();
//     expect(dynamicDataSource.isConnected).toBe(true);
//
//     const data = component.dataSource.data;
//     expectTableToMatchContent(tableElement, [
//       ['Column A'],
//       [data[0].a],
//       [data[1].a],
//       [data[2].a],
//     ]);
//
//     // Remove the data source and check to make sure the table is empty again.
//     component.dataSource = null;
//     dynamicDataSourceFixture.detectChanges();
//
//     // Expect that the old data source has been disconnected.
//     expect(dynamicDataSource.isConnected).toBe(false);
//     expectTableToMatchContent(tableElement, [
//       ['Column A']
//     ]);
//
//     // Reconnect a data source and check that the table is populated
//     const newDynamicDataSource = new FakeDataSource();
//     component.dataSource = newDynamicDataSource;
//     dynamicDataSourceFixture.detectChanges();
//     expect(newDynamicDataSource.isConnected).toBe(true);
//
//     const newData = component.dataSource.data;
//     expectTableToMatchContent(tableElement, [
//       ['Column A'],
//       [newData[0].a],
//       [newData[1].a],
//       [newData[2].a],
//     ]);
//   });
//
//   it('should be able to apply classes to rows based on their context', () => {
//     const contextFixture = TestBed.createComponent(RowContextCdkTableApp);
//     const contextComponent = contextFixture.componentInstance;
//     tableElement = contextFixture.nativeElement.querySelector('cdk-table');
//     contextFixture.detectChanges();
//
//     let rowElements = contextFixture.nativeElement.querySelectorAll('cdk-row');
//
//     // Rows should not have any context classes
//     for (let i = 0; i < rowElements.length; i++) {
//       expect(rowElements[i].classList.contains('custom-row-class-first')).toBe(false);
//       expect(rowElements[i].classList.contains('custom-row-class-last')).toBe(false);
//       expect(rowElements[i].classList.contains('custom-row-class-even')).toBe(false);
//       expect(rowElements[i].classList.contains('custom-row-class-odd')).toBe(false);
//     }
//
//     // Enable all the context classes
//     contextComponent.enableRowContextClasses = true;
//     contextFixture.detectChanges();
//
//     expect(rowElements[0].classList.contains('custom-row-class-first')).toBe(true);
//     expect(rowElements[0].classList.contains('custom-row-class-last')).toBe(false);
//     expect(rowElements[0].classList.contains('custom-row-class-even')).toBe(true);
//     expect(rowElements[0].classList.contains('custom-row-class-odd')).toBe(false);
//
//     expect(rowElements[1].classList.contains('custom-row-class-first')).toBe(false);
//     expect(rowElements[1].classList.contains('custom-row-class-last')).toBe(false);
//     expect(rowElements[1].classList.contains('custom-row-class-even')).toBe(false);
//     expect(rowElements[1].classList.contains('custom-row-class-odd')).toBe(true);
//
//     expect(rowElements[2].classList.contains('custom-row-class-first')).toBe(false);
//     expect(rowElements[2].classList.contains('custom-row-class-last')).toBe(true);
//     expect(rowElements[2].classList.contains('custom-row-class-even')).toBe(true);
//     expect(rowElements[2].classList.contains('custom-row-class-odd')).toBe(false);
//   });
//
//   it('should be able to apply classes to cells based on their row context', () => {
//     const contextFixture = TestBed.createComponent(RowContextCdkTableApp);
//     const contextComponent = contextFixture.componentInstance;
//     tableElement = contextFixture.nativeElement.querySelector('cdk-table');
//     contextFixture.detectChanges();
//
//     const rowElements = contextFixture.nativeElement.querySelectorAll('cdk-row');
//
//     for (let i = 0; i < rowElements.length; i++) {
//       // Cells should not have any context classes
//       const cellElements = rowElements[i].querySelectorAll('cdk-cell');
//       for (let j = 0; j < cellElements.length; j++) {
//         expect(cellElements[j].classList.contains('custom-cell-class-first')).toBe(false);
//         expect(cellElements[j].classList.contains('custom-cell-class-last')).toBe(false);
//         expect(cellElements[j].classList.contains('custom-cell-class-even')).toBe(false);
//         expect(cellElements[j].classList.contains('custom-cell-class-odd')).toBe(false);
//       }
//     }
//
//     // Enable the context classes
//     contextComponent.enableCellContextClasses = true;
//     contextFixture.detectChanges();
//
//     let cellElement = rowElements[0].querySelectorAll('cdk-cell')[0];
//     expect(cellElement.classList.contains('custom-cell-class-first')).toBe(true);
//     expect(cellElement.classList.contains('custom-cell-class-last')).toBe(false);
//     expect(cellElement.classList.contains('custom-cell-class-even')).toBe(true);
//     expect(cellElement.classList.contains('custom-cell-class-odd')).toBe(false);
//
//     cellElement = rowElements[1].querySelectorAll('cdk-cell')[0];
//     expect(cellElement.classList.contains('custom-cell-class-first')).toBe(false);
//     expect(cellElement.classList.contains('custom-cell-class-last')).toBe(false);
//     expect(cellElement.classList.contains('custom-cell-class-even')).toBe(false);
//     expect(cellElement.classList.contains('custom-cell-class-odd')).toBe(true);
//
//     cellElement = rowElements[2].querySelectorAll('cdk-cell')[0];
//     expect(cellElement.classList.contains('custom-cell-class-first')).toBe(false);
//     expect(cellElement.classList.contains('custom-cell-class-last')).toBe(true);
//     expect(cellElement.classList.contains('custom-cell-class-even')).toBe(true);
//     expect(cellElement.classList.contains('custom-cell-class-odd')).toBe(false);
//   });
// });
//
// interface TestData {
//   a: string;
//   b: string;
//   c: string;
//   children: TestData[];
// }
//
// class FakeDataSource extends DataSource<TestData> {
//   isConnected = false;
//
//   _dataChange = new BehaviorSubject<TestData[]>([]);
//   set data(data: TestData[]) { this._dataChange.next(data); }
//   get data() { return this._dataChange.getValue(); }
//
//   constructor() {
//     super();
//     for (let i = 0; i < 3; i++) { this.addData(); }
//   }
//
//   connect(collectionViewer: CollectionViewer): Observable<TestData[]> {
//     this.isConnected = true;
//     const streams = [this._dataChange, collectionViewer.viewChange];
//     return map.call(combineLatest(streams), ([data]) => data);
//   }
//
//   disconnect() {
//     this.isConnected = false;
//   }
//
//   addData() {
//     const nextIndex = this.data.length + 1;
//
//     let copiedData = this.data.slice();
//     copiedData.push({
//       a: `a_${nextIndex}`,
//       b: `b_${nextIndex}`,
//       c: `c_${nextIndex}`
//     });
//
//     this.data = copiedData;
//   }
// }
//
// @Component({
//   template: `
//     <cdk-tree [dataSource]="dataSource">
//       <cdk-tree-node *cdkNodeDef="let node"></cdk-tree-node>
//     </cdk-tree>
//   `
// })
// class SimpleCdkTreeApp {
//   dataSource: FakeDataSource | null = new FakeDataSource();
//
//   @ViewChild(CdkTree) tree: CdkTree<TestData>;
// }
//
// @Component({
//   template: `
//     <cdk-tree [dataSource]="dataSource">
//       <cdk-tree-node *cdkNodeDef="let node"></cdk-tree-node>
//       <cdk-tree-node *cdkNodeDef="let node; when: isGroup"></cdk-tree-node>
//       <cdk-tree-node *cdkNodeDef="let node; when: isLeaf"></cdk-tree-node>
//       <cdk-tree-node *cdkNodeDef="let node; when: isFirst"></cdk-tree-node>
//     </cdk-tree>
//   `
// })
// class WhenNodeCdkTreeApp {
//   dataSource: FakeDataSource = new FakeDataSource();
//   isFirst = (_nodeData: TestData, index: number) => index == 1;
//   isLeaf = (nodeData: TestData) => !nodeData.children;
//   isGroup = (nodeData: TestData) => !!nodeData.children;
//
//   constructor() { this.dataSource.addData(); }
//
//   @ViewChild(CdkTree) tree: CdkTree<TestData>;
// }
//
// @Component({
//   template: `
//     <cdk-tree [dataSource]="dataSource">
//       <cdk-tree-node *cdkRowDef="let row; columns: ['index1Column']; when: isFirst"></cdk-tree-node>
//       <cdk-row *cdkRowDef="let row; columns: ['c3Column']; when: isLeaf"></cdk-row>
//     </cdk-tree>
//   `
// })
// class WhenRowWithoutDefaultCdkTableApp {
//   dataSource: FakeDataSource = new FakeDataSource();
//   isFirst = (_nodeData: TestData, index: number) => index == 1;
//   isLeaf = (nodeData: TestData) => !nodeData.children;
//   isGroup = (nodeData: TestData) => !!nodeData.children;
//
//   @ViewChild(CdkTree) table: CdkTree<TestData>;
// }
//
// @Component({
//   template: `
//     <cdk-table [dataSource]="dataSource">
//       <cdk-tree-node *cdkNodeDef="let node"></cdk-tree-node>
//       <cdk-tree-node *cdkNodeDef="let node"></cdk-tree-node>
//       <cdk-tree-node *cdkNodeDef="let node; when: hasChild"></cdk-tree-node>
//     </cdk-table>
//   `
// })
// class WhenNodeMultipleDefaultsCdkTreeApp {
//   dataSource: FakeDataSource = new FakeDataSource();
//   hasChild = (_nodeData: TestData) => !!_nodeData.children;
//
//   @ViewChild(CdkTree) tree: CdkTree<TestData>;
// }
//
// @Component({
//   template: `
//     <cdk-tree [dataSource]="dataSource">
//       <cdk-tree-node *cdkNodeDef="let node"></cdk-tree-node>
//     </cdk-tree>
//   `
// })
// class DynamicDataSourceCdkTreeApp {
//   dataSource: FakeDataSource;
//
//   @ViewChild(CdkTree) tree: CdkTree<TestData>;
// }
//
// @Component({
//   template: `
//     <cdk-tree [dataSource]="dataSource">
//       <cdk-tree-node *cdkNodeDef="let node;
//                            let first = first; let last = last; let even = even; let odd = odd"
//                [ngClass]="{
//                  'custom-row-class-first': enableNodeContextClasses && first,
//                  'custom-row-class-last': enableNodeContextClasses && last,
//                  'custom-row-class-even': enableNodeContextClasses && even,
//                  'custom-row-class-odd': enableNodeContextClasses && odd
//                }">
//       </cdk-tree-node>
//     </cdk-tree>
//   `
// })
// class NodeContextCdkTreeApp {
//   dataSource: FakeDataSource = new FakeDataSource();
//   enableNodeContextClasses = false;
// }
//
// function getElements(element: Element, query: string): Element[] {
//   return [].slice.call(element.querySelectorAll(query));
// }
//
// function getNodes(tableElement: Element): Element {
//   return tableElement.querySelector('.cdk-tree-node')!;
// }
//
// function expectTableToMatchContent(tableElement: Element, expectedTreeContent: any[]) {
//   const missedExpectations: string[] = [];
//   function checkNodeContent(node: Element, expectedTextContent: string) {
//     const actualTextContent = node.textContent!.trim();
//     if (actualTextContent !== expectedTextContent) {
//       missedExpectations.push(
//         `Expected node contents to be ${expectedTextContent} but was ${actualTextContent}`);
//     }
//   }
//
//   // Check nodes
//   const expectedNodeContent = expectedTreeContent.shift();
//   getNodes(tableElement).forEach((node, index) => {
//     const expected = expectedNodeContent ?
//       expectedNodeContent[index] :
//       null;
//     checkNodeContent(node, expected);
//   });
//
//   if (missedExpectations.length) {
//     fail(missedExpectations.join('\n'));
//   }
// }
