import React, { useState } from 'react';
import { Node } from '@xyflow/react';
import FileManager from './FileManager';
import TreeTools from './TreeTools';
import NodeInspector from './NodeInspector';
import { LoadedFile, CircleNodeData } from '../../types/tree';

type Tab = 'FILES' | 'TOOLS' | 'INSPECT';

interface SidebarProps {
  files: LoadedFile[];
  selectedFileId: string;
  isDragging: boolean;
  error: string | null;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent) => Promise<void>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  setSelectedFileId: (id: string) => void;
  setError: (err: string | null) => void;
  deleteFile: (id: string, e: React.MouseEvent) => void;
  maxDepth: number;
  setMaxDepth: (depth: number) => void;
  orientation: 'LR' | 'TB';
  setOrientation: (o: 'LR' | 'TB') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedNode: Node<CircleNodeData> | null;
  activeFile: LoadedFile | undefined;
}

export default function Sidebar(props: SidebarProps) {
  const [activeTab, setActiveTab] = useState<Tab>('FILES');

  return (
    <aside className="w-96 border-r border-zinc-200 dark:border-zinc-800 flex flex-col bg-white dark:bg-[#08080a] shrink-0 h-full overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 shrink-0 bg-white dark:bg-transparent">
        <button
          onClick={() => setActiveTab('FILES')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'FILES'
              ? 'bg-white dark:bg-[#1a0f0a] text-orange-600 dark:text-orange-400 border-b-2 border-orange-500'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900'
          }`}
        >
          Files
        </button>
        <button
          onClick={() => setActiveTab('TOOLS')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'TOOLS'
              ? 'bg-white dark:bg-[#1a0f0a] text-orange-600 dark:text-orange-400 border-b-2 border-orange-500'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900'
          }`}
        >
          Tools
        </button>
        <button
          onClick={() => setActiveTab('INSPECT')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'INSPECT'
              ? 'bg-white dark:bg-[#1a0f0a] text-orange-600 dark:text-orange-400 border-b-2 border-orange-500'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900'
          }`}
        >
          Inspector
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'FILES' && (
          <FileManager
            files={props.files}
            selectedFileId={props.selectedFileId}
            isDragging={props.isDragging}
            error={props.error}
            handleDragOver={props.handleDragOver}
            handleDragLeave={props.handleDragLeave}
            handleDrop={props.handleDrop}
            handleFileChange={props.handleFileChange}
            setSelectedFileId={props.setSelectedFileId}
            setError={props.setError}
            deleteFile={props.deleteFile}
          />
        )}
        {activeTab === 'TOOLS' && (
          <TreeTools
            maxDepth={props.maxDepth}
            setMaxDepth={props.setMaxDepth}
            orientation={props.orientation}
            setOrientation={props.setOrientation}
            searchQuery={props.searchQuery}
            setSearchQuery={props.setSearchQuery}
          />
        )}
        {activeTab === 'INSPECT' && (
          <NodeInspector
            selectedNode={props.selectedNode}
            activeFile={props.activeFile}
          />
        )}
      </div>
    </aside>
  );
}

