"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  NodeTypes,
  Node,
  Edge,
} from "@xyflow/react";
import CircleNodeComponent from "./components/circle-node";
import Sidebar from "./components/sidebar/Sidebar";
import { LoadedFile, CircleNodeData } from "./types/tree";
import { buildGraphData, getSearchHighlightIds, validateJsonTree } from "./utils/tree-parser";
import { getLayoutedElements } from "./utils/graph-layout";

const nodeTypes: NodeTypes = {
  circleNode: CircleNodeComponent,
};

export default function Home() {
  const [files, setFiles] = useState<LoadedFile[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string>("");
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<CircleNodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loaderChar, setLoaderChar] = useState<string>("/");
  const [orientation, setOrientation] = useState<"LR" | "TB">("TB");
  const [selectedNode, setSelectedNode] = useState<Node<CircleNodeData> | null>(null);

  const selectedNodeRef = useRef(selectedNode);
  useEffect(() => {
    selectedNodeRef.current = selectedNode;
  }, [selectedNode]);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [maxDepth, setMaxDepth] = useState<number>(20);
  const [isDark, setIsDark] = useState<boolean>(false);

  // Retro CLI Loading character effect
  useEffect(() => {
    if (!loading) return;
    const chars = ["/", "-", "\\", "|"];
    let idx = 0;
    const interval = setInterval(() => {
      setLoaderChar(chars[idx % chars.length]);
      idx++;
    }, 100);
    return () => clearInterval(interval);
  }, [loading]);

  // Load sample on mount
  useEffect(() => {
    fetch("/crackmips.json")
      .then((res) => {
        if (!res.ok) throw new Error("Could not fetch sample crackmips.json file");
        return res.json();
      })
      .then((data) => {
        const sample: LoadedFile = {
          id: "sample-gen",
          name: "crackmips.json (Sample)",
          data,
        };
        setFiles([sample]);
        setSelectedFileId(sample.id);
      })
      .catch((err) => {
        console.warn("Could not preload sample crackmips.json:", err.message);
      });
  }, []);

  // Update layout when file, orientation, or search changes
  useEffect(() => {
    const file = files.find((f) => f.id === selectedFileId);
    if (!file) return;

    const tLoading = setTimeout(() => {
      setLoading(true);
    }, 0);

    const t = setTimeout(() => {
      try {
        const nodesList: Node<CircleNodeData>[] = [];
        const edgesList: Edge[] = [];

        buildGraphData(file.data, "root", nodesList, edgesList, new Set(), 0, maxDepth);
        const highlights = getSearchHighlightIds(nodesList, searchQuery);

        const finalNodesList: Node<CircleNodeData>[] = [];
        const finalEdgesList: Edge[] = [];
        buildGraphData(file.data, "root", finalNodesList, finalEdgesList, highlights, 0, maxDepth);

        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
          finalNodesList,
          finalEdgesList,
          orientation
        );

        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
        setError(null);

        const currentSelected = selectedNodeRef.current;
        if (currentSelected) {
          const updatedSelected = layoutedNodes.find((n) => n.id === currentSelected.id);
          setSelectedNode(updatedSelected || null);
        }
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        setError(`Layout generation failed: ${errorMsg}`);
      } finally {
        setLoading(false);
      }
    }, 50);

    return () => {
      clearTimeout(tLoading);
      clearTimeout(t);
    };
  }, [selectedFileId, files, orientation, searchQuery, maxDepth, setNodes, setEdges]);

  const processFiles = async (filesList: File[]) => {
    const newFiles: LoadedFile[] = [];
    let lastValidId = selectedFileId;
    let valError: string | null = null;

    for (const file of filesList) {
      if (!file.name.endsWith(".json")) {
        valError = `File "${file.name}" rejected: Must be a JSON file.`;
        continue;
      }

      try {
        const text = await file.text();
        const parsed = JSON.parse(text);
        const parseError = validateJsonTree(parsed);

        if (parseError) {
          valError = `File "${file.name}" invalid schema: ${parseError}`;
          continue;
        }

        const fileId = `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        newFiles.push({
          id: fileId,
          name: file.name,
          data: parsed,
        });
        lastValidId = fileId;
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        valError = `Failed to parse "${file.name}": ${errorMsg}`;
      }
    }

    if (newFiles.length > 0) {
      setFiles((prev) => [...prev, ...newFiles]);
      setSelectedFileId(lastValidId);
      setError(null);
    }

    if (valError) {
      setError(valError);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      await processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      await processFiles(Array.from(e.target.files));
    }
  };

  const deleteFile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = files.filter((f) => f.id !== id);
    setFiles(updated);
    if (selectedFileId === id) {
      setSelectedFileId(updated.length > 0 ? updated[0].id : "");
      setSelectedNode(null);
    }
  };

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node<CircleNodeData>) => {
    setSelectedNode(node);
  }, []);

  const activeFile = files.find((f) => f.id === selectedFileId);

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden font-mono select-none transition-colors ${isDark ? "dark bg-zinc-950 text-zinc-100" : "bg-white text-zinc-900"}`}>
      <header className="h-14 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-6 bg-white dark:bg-zinc-900/40 shrink-0">
        <div className="flex items-center gap-4">
          <span className="font-bold text-sm tracking-wider text-orange-600 dark:text-orange-500">
            RZ-PRELUDE-VISUALIZER
          </span>
          <a
            href="https://github.com/MrQuantum1915/rz-prelude-visualize"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-zinc-800 dark:hover:text-white transition-colors"
            title="View on GitHub"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
        </div>

        {/* Global Statistics Bar */}
        <div className="flex items-center gap-6 text-sm text-zinc-600 dark:text-zinc-300">
          <div>
            FILES:{" "}
            <span className="text-zinc-900 dark:text-white font-bold">{files.length}</span>
          </div>
          <div>
            NODES:{" "}
            <span className="text-zinc-900 dark:text-white font-bold">{nodes.length}</span>
          </div>
          <div>
            EDGES:{" "}
            <span className="text-zinc-900 dark:text-white font-bold">{edges.length}</span>
          </div>
          <div className="flex items-center gap-2">
            TOTAL ANALYZED:{" "}
            {activeFile ? (
              <span className="text-orange-600 dark:text-orange-400 font-bold">
                {activeFile.data.hit_cnt}
              </span>
            ) : (
              <span className="text-zinc-400 font-bold">
                0
              </span>
            )}
          </div>
          <button
            onClick={() => setIsDark(!isDark)}
            className="ml-2 p-1.5 border border-zinc-300 dark:border-zinc-700 rounded-none bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center justify-center"
            title="Toggle Light/Dark Mode"
          >
            {isDark ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Main workspace container */}
      <div className="flex-1 flex flex-row overflow-hidden relative">
        <Sidebar
          files={files}
          selectedFileId={selectedFileId}
          isDragging={isDragging}
          error={error}
          handleDragOver={handleDragOver}
          handleDragLeave={handleDragLeave}
          handleDrop={handleDrop}
          handleFileChange={handleFileChange}
          setSelectedFileId={setSelectedFileId}
          setError={setError}
          deleteFile={deleteFile}
          maxDepth={maxDepth}
          setMaxDepth={setMaxDepth}
          orientation={orientation}
          setOrientation={setOrientation}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedNode={selectedNode}
          activeFile={activeFile}
        />

        {/* Right Flow Graph Area */}
        <main className="flex-1 h-full bg-white dark:bg-zinc-950 relative transition-colors">
          {files.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-white dark:bg-zinc-950 z-10 font-mono border border-transparent transition-colors">
              <div className="text-zinc-400 dark:text-zinc-600 text-xs mb-3">
                [!] NO ACTIVE PRELUDE PREFIX TREE DETECTED
              </div>
            </div>
          ) : null}

          {/* Simple retro loader overlay during rendering */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-zinc-950/80 z-20 font-mono text-sm tracking-widest text-zinc-600 dark:text-zinc-300">
              <span className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-4 py-3 select-none shadow-xl">
                [{loaderChar}] LAYOUTING PROLOGUE TREE...
              </span>
            </div>
          )}

          {/* React Flow Container */}
          <div className="w-full h-full">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.15 }}
              minZoom={0.05}
              maxZoom={1.5}
            >
              <Background color={isDark ? "#27272a" : "#e4e4e7"} gap={20} size={1} />
              <Controls showInteractive={false} position="top-right" />
              <MiniMap
                position="bottom-right"
                style={{
                  background: isDark ? "#09090b" : "#ffffff",
                  border: isDark ? "1px solid #27272a" : "1px solid #e4e4e7",
                  borderRadius: "0px",
                }}
                nodeColor={isDark ? "#27272a" : "#d4d4d8"}
                maskColor={isDark ? "rgba(0, 0, 0, 0.6)" : "rgba(255, 255, 255, 0.6)"}
              />
            </ReactFlow>
          </div>
        </main>
      </div>
    </div>
  );
}
