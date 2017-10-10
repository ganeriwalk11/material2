

export interface SimpleTreeNode {
  children: SimpleTreeNode[];
}

export class JsonNode implements SimpleTreeNode {
  children: JsonNode[];
  key: string;
  value: any;
}
