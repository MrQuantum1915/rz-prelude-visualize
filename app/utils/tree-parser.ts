import { TreeNode, CircleNodeData } from "../types/tree";
import { Node, Edge } from "@xyflow/react";

export const formatByte = (b: number): string =>
  b.toString(16).padStart(2, "0").toUpperCase();

export const formatBits = (b: number): string =>
  b.toString(2).padStart(8, "0");

export const validateJsonTree = (data: unknown): string | null => {
  if (typeof data !== "object" || data === null) {
    return "JSON must be a root object.";
  }
  const dataObj = data as Record<string, unknown>;
  if (typeof dataObj.hit_cnt !== "number") {
    return 'Missing "hit_cnt" number in root object.';
  }
  if (dataObj.children !== undefined) {
    if (!Array.isArray(dataObj.children)) {
      return '"children" must be an array of nodes.';
    }

    const validateNode = (node: unknown, path: string): string | null => {
      if (typeof node !== "object" || node === null) {
        return `Node at ${path} must be an object.`;
      }
      const nodeObj = node as Record<string, unknown>;
      if (typeof nodeObj.hit_cnt !== "number") {
        return `Node at ${path} is missing "hit_cnt" or it is not a number.`;
      }
      if (typeof nodeObj.byte_val !== "number") {
        return `Node at ${path} is missing "byte_val" or it is not a number.`;
      }
      const byteVal = nodeObj.byte_val as number;
      if (byteVal < 0 || byteVal > 255) {
        return `Node at ${path} has invalid "byte_val" ${byteVal} (must be 0-255).`;
      }
      if (nodeObj.children !== undefined) {
        if (!Array.isArray(nodeObj.children)) {
          return `Node at ${path} "children" must be an array.`;
        }
        for (let i = 0; i < nodeObj.children.length; i++) {
          const hex = `0x${formatByte(byteVal)}`;
          const err = validateNode(
            nodeObj.children[i],
            `${path} -> child[${i}] (${hex})`
          );
          if (err) return err;
        }
      }
      return null;
    };

    for (let i = 0; i < dataObj.children.length; i++) {
      const err = validateNode(dataObj.children[i], `root -> child[${i}]`);
      if (err) return err;
    }
  }
  return null;
};

export const getSearchHighlightIds = (nodes: Node<CircleNodeData>[], query: string): Set<string> => {
  const highlights = new Set<string>();
  if (!query.trim()) return highlights;

  const tokens = query
    .toUpperCase()
    .replace(/0X/g, "")
    .split(/[\s,:-]+/)
    .filter((t) => t.match(/^[0-9A-F]{2}$/));

  if (tokens.length === 0) return highlights;

  const targetTokenPath = tokens.join("-");
  const matchingNodes = nodes.filter((node) => node.id.includes(targetTokenPath));

  matchingNodes.forEach((node) => {
    const parts = node.id.split("-");
    let current = "root";
    highlights.add(current);
    for (let i = 1; i < parts.length; i++) {
      current = `${current}-${parts[i]}`;
      highlights.add(current);
    }
  });

  return highlights;
};

export const buildGraphData = (
  node: TreeNode,
  parentPath: string = "root",
  nodesList: Node<CircleNodeData>[] = [],
  edgesList: Edge[] = [],
  searchPathIds: Set<string> = new Set(),
  currentDepth: number = 0,
  maxDepth: number = 100,
  parent_hit_cnt?: number
) => {
  if (currentDepth > maxDepth) return;

  const isRoot = node.byte_val === undefined;
  const currentPath = isRoot ? "root" : `${parentPath}-${formatByte(node.byte_val!)}`;
  const label = isRoot ? "Root" : `0x${formatByte(node.byte_val!)}`;
  const isSearchPath = searchPathIds.has(currentPath);

  nodesList.push({
    id: currentPath,
    type: "circleNode",
    data: {
      label,
      hit_cnt: node.hit_cnt,
      parent_hit_cnt,
      byte_val: node.byte_val,
      isSearchPath,
    },
    position: { x: 0, y: 0 },
  });

  if (!isRoot) {
    edgesList.push({
      id: `edge-${parentPath}-${currentPath}`,
      source: parentPath,
      target: currentPath,
      type: "smoothstep",
      className: isSearchPath ? "search-path" : "",
    });
  }

  if (node.children) {
    for (const child of node.children) {
      buildGraphData(child, currentPath, nodesList, edgesList, searchPathIds, currentDepth + 1, maxDepth, node.hit_cnt);
    }
  }
};

export const getNodePathString = (nodeId: string) => {
  const parts = nodeId.split("-");
  return parts
    .map((p) => {
      if (p === "root") return "Root";
      return `0x${p}`;
    })
    .join(" → ");
};
