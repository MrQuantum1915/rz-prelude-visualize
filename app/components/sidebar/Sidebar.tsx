import React, { useState } from 'react';
import { Node } from '@xyflow/react';
import FileManager from './FileManager';
import TreeTools from './TreeTools';
import NodeInspector from './NodeInspector';
import { LoadedFile, CircleNodeData } from '../../types/tree';

type Tab = 'FILES' | 'TOOLS' | 'INSPECT';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onOpenHelp: () => void;
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
  isHeatmap: boolean;
  setIsHeatmap: (b: boolean) => void;
  heatmapPalette: string;
  setHeatmapPalette: (p: string) => void;
}

export default function Sidebar(props: SidebarProps) {
  const [activeTab, setActiveTab] = useState<Tab>('FILES');

  return (
    <aside className={`
      flex flex-col bg-white dark:bg-[#08080a] shrink-0 h-full overflow-hidden transition-all duration-300 ease-in-out
      
      /* Desktop layout (md and up) */
      md:relative md:border-r md:border-zinc-200 md:dark:border-zinc-800
      ${props.isOpen ? 'md:w-96 md:opacity-100' : 'md:w-0 md:opacity-0 md:border-r-0 pointer-events-none'}
      
      /* Mobile layout (under md) */
      max-md:fixed max-md:top-0 max-md:left-0 max-md:z-40 max-md:w-[280px] max-md:shadow-2xl max-md:border-r max-md:border-zinc-200 max-md:dark:border-zinc-800
      ${props.isOpen ? 'max-md:translate-x-0' : 'max-md:-translate-x-full'}
    `}>
      {/* Tab Navigation */}
      <div className="flex items-center border-b border-zinc-200 dark:border-zinc-800 shrink-0 bg-white dark:bg-transparent pr-2">
        <button
          onClick={() => setActiveTab('FILES')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'FILES'
              ? 'bg-white dark:bg-[#1a0f0a] text-orange-600 dark:text-orange-400 border-b-2 border-orange-500'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900'
            }`}
        >
          Files
        </button>
        <button
          onClick={() => setActiveTab('TOOLS')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'TOOLS'
              ? 'bg-white dark:bg-[#1a0f0a] text-orange-600 dark:text-orange-400 border-b-2 border-orange-500'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900'
            }`}
        >
          Tools
        </button>
        <button
          onClick={() => setActiveTab('INSPECT')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'INSPECT'
              ? 'bg-white dark:bg-[#1a0f0a] text-orange-600 dark:text-orange-400 border-b-2 border-orange-500'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900'
            }`}
        >
          Inspector
        </button>

        {/* Close Button on Mobile inside the tab bar */}
        <button
          onClick={props.onToggle}
          title="Close Sidebar"
          className="text-zinc-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 px-2 py-1 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 border border-transparent hover:border-red-200 dark:hover:border-red-900/60 rounded-none transition-all font-sans md:hidden ml-1.5 cursor-pointer"
        >
          ✕
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
            isHeatmap={props.isHeatmap}
            setIsHeatmap={props.setIsHeatmap}
            heatmapPalette={props.heatmapPalette}
            setHeatmapPalette={props.setHeatmapPalette}
          />
        )}
        {activeTab === 'INSPECT' && (
          <NodeInspector
            selectedNode={props.selectedNode}
            activeFile={props.activeFile}
          />
        )}
      </div>

      {/* Mobile-only Sidebar Footer */}
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/10 flex items-center justify-between shrink-0 text-xs text-zinc-500 md:hidden font-mono">
        <button
          onClick={props.onOpenHelp}
          className="hover:text-orange-500 transition-colors font-bold font-sans cursor-pointer"
        >
          HELP (?)
        </button>
        <a
          href="https://github.com/MrQuantum1915/rz-prelude-visualize"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-orange-500 transition-colors"
        >
          GITHUB
        </a>
      </div>

      {/* Desktop-only Sidebar Footer */}
      <div className="py-2.5 px-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 dark:bg-[#0c0c0e]/30 flex items-center justify-between shrink-0 text-[10px] text-zinc-400 dark:text-zinc-500 font-mono hidden md:flex">
        <span>TOGGLE SIDEBAR</span>
        <span>
          <kbd className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-1.5 py-0.5 rounded-sm">Ctrl</kbd>
          <span> + </span>
          <kbd className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-1.5 py-0.5 rounded-sm">B</kbd>
        </span>
      </div>
    </aside>
  );
}

