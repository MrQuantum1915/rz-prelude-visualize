export interface TreeNode {
  hit_cnt: number;
  byte_val?: number;
  children?: TreeNode[];
}

export interface LoadedFile {
  id: string;
  name: string;
  data: TreeNode;
}

export type CircleNodeData = {
  label: string;
  hit_cnt: number;
  parent_hit_cnt?: number;
  byte_val?: number;
  isSearchPath?: boolean;
  orientation?: 'LR' | 'TB';
};