import React from 'react';

interface TreeToolsProps {
  maxDepth: number;
  setMaxDepth: (depth: number) => void;
  orientation: 'LR' | 'TB';
  setOrientation: (o: 'LR' | 'TB') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isHeatmap: boolean;
  setIsHeatmap: (b: boolean) => void;
  heatmapPalette: string;
  setHeatmapPalette: (p: string) => void;
}

export default function TreeTools({
  maxDepth,
  setMaxDepth,
  orientation,
  setOrientation,
  searchQuery,
  setSearchQuery,
  isHeatmap,
  setIsHeatmap,
  heatmapPalette,
  setHeatmapPalette,
}: TreeToolsProps) {
  return (
    <div className="flex flex-col h-full divide-y divide-zinc-200 dark:divide-zinc-800 overflow-y-auto">
      {/* Tree Depth Control */}
      <div className="p-5">
        <div className="text-sm font-bold text-zinc-600 dark:text-zinc-400 tracking-wider uppercase mb-3 flex justify-between items-center">
          <div>TREE DEPTH</div>
          <input
            type="number"
            min="1"
            max="100"
            value={maxDepth}
            onChange={(e) => setMaxDepth(parseInt(e.target.value) || 1)}
            className="w-16 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-2 py-1 text-xs text-zinc-900 dark:text-white outline-none focus:border-orange-500 transition-colors"
          />
        </div>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="1"
            max="50"
            value={maxDepth}
            onChange={(e) => setMaxDepth(parseInt(e.target.value))}
            className="flex-1 accent-orange-500 h-1.5 bg-zinc-300 dark:bg-zinc-800 rounded-none appearance-none cursor-pointer"
          />
        </div>
        <div className="text-xs text-zinc-500 mt-2 leading-relaxed">
          Adjust the maximum prologue length shown in the tree to reduce clutter.
        </div>
      </div>

      {/* Heatmap Settings */}
      <div className="p-5">
        <div className="text-sm font-bold text-zinc-600 dark:text-zinc-400 tracking-wider uppercase mb-3 flex justify-between items-center">
          <div>HEATMAP (FREQUENCY)</div>
          <div className="flex border border-zinc-300 dark:border-zinc-700 rounded-none overflow-hidden text-xs font-bold">
            <button
              onClick={() => setIsHeatmap(true)}
              className={`px-3 py-1 transition-colors ${
                isHeatmap
                  ? "bg-orange-50 dark:bg-[#1a0f0a] text-orange-600 dark:text-white"
                  : "bg-white dark:bg-[#0c0c0e] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              }`}
            >
              ON
            </button>
            <button
              onClick={() => setIsHeatmap(false)}
              className={`px-3 py-1 transition-colors border-l border-zinc-300 dark:border-zinc-700 ${
                !isHeatmap
                  ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-white"
                  : "bg-white dark:bg-[#0c0c0e] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              }`}
            >
              OFF
            </button>
          </div>
        </div>
        
        {isHeatmap && (
          <div className="mt-4">
            <div className="text-xs font-bold text-zinc-500 dark:text-zinc-500 tracking-wider uppercase mb-2">
              COLOR PALETTE
            </div>
            <select
              value={heatmapPalette}
              onChange={(e) => setHeatmapPalette(e.target.value)}
              className="w-full bg-white dark:bg-[#0c0c0e] border border-zinc-200 dark:border-zinc-700 focus:border-orange-500 outline-none text-sm px-2 py-2 text-zinc-900 dark:text-white font-mono rounded-none transition-colors"
            >
              <option value="rocket">Rocket (Seaborn)</option>
              <option value="mako">Mako (Seaborn)</option>
              <option value="viridis">Viridis (Matplotlib)</option>
            </select>
          </div>
        )}
      </div>

      {/* Visual settings */}
      <div className="p-5">
        <div className="text-sm font-bold text-zinc-600 dark:text-zinc-400 tracking-wider uppercase mb-3">
          ALIGNMENT
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setOrientation("LR")}
            className={`border text-sm font-bold uppercase tracking-wider rounded-none cursor-pointer transition-all py-3 ${
              orientation === "LR"
                ? "border-orange-500/50 bg-orange-50 dark:bg-[#1a0f0a] text-orange-600 dark:text-white"
                : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c0c0e] text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-600"
            }`}
          >
            Horiz (LR)
          </button>
          <button
            onClick={() => setOrientation("TB")}
            className={`border text-sm font-bold uppercase tracking-wider rounded-none cursor-pointer transition-all py-3 ${
              orientation === "TB"
                ? "border-orange-500/50 bg-orange-50 dark:bg-[#1a0f0a] text-orange-600 dark:text-white"
                : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c0c0e] text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-600"
            }`}
          >
            Vert (TB)
          </button>
        </div>
      </div>

      {/* Node search filter */}
      <div className="p-5">
        <div className="text-sm font-bold text-zinc-600 dark:text-zinc-400 tracking-wider uppercase mb-3">
          HIGHLIGHT PATH
        </div>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="e.g. 08 00 E0"
            className="w-full bg-white dark:bg-[#08080a] border border-zinc-200 dark:border-zinc-700 focus:border-orange-500 outline-none text-base px-3 py-3 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 font-mono rounded-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-3.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-white text-sm font-sans"
            >
              ✕
            </button>
          )}
        </div>
        <div className="text-xs text-zinc-500 mt-3 leading-relaxed">
          Enter hex bytes separated by spaces, commas, or dashes. The full path matching
          the sequence will be highlighted in orange.
        </div>
      </div>
    </div>
  );
}
