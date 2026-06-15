import dagre from "dagre"
import { Node, Edge } from "@xyflow/react";

export const getLayoutedElements = <T extends Node = Node>(
  nodes: T[],
  edges: Edge[],
  direction: "LR" | "TB" = "LR"
) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const isHorizontal = direction === "LR";

  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 80,
    ranksep: 130,
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 56, height: 56 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      targetPosition: isHorizontal ? "left" : "top",
      sourcePosition: isHorizontal ? "right" : "bottom",
      position: {
        x: nodeWithPosition.x - 28, // Center circle node (56px / 2)
        y: nodeWithPosition.y - 28,
      },
      data: {
        ...node.data,
        orientation: direction,
      },
    };
  });

  return { nodes: layoutedNodes as T[], edges };
};
